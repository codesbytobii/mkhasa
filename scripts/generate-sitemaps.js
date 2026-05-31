/* eslint-env node */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://www.mkhasa.com";
const API_BASE = "https://mkhasa-bfdb6fabd978.herokuapp.com/api/v1";
const TODAY = new Date().toISOString().split("T")[0];

const toDate = (value) => {
  if (!value) return TODAY;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return TODAY;
  return date.toISOString().split("T")[0];
};

const escapeXml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const slugify = (text) => {
  if (!text) return "";
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

const xmlUrlset = (urls) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const url of urls) {
    xml += "  <url>\n";
    xml += `    <loc>${escapeXml(url.loc)}</loc>\n`;
    xml += `    <lastmod>${url.lastmod || TODAY}</lastmod>\n`;
    if (url.changefreq) xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    if (url.priority) xml += `    <priority>${url.priority}</priority>\n`;
    xml += "  </url>\n";
  }
  xml += "</urlset>\n";
  return xml;
};

const xmlSitemapIndex = (files) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const file of files) {
    xml += "  <sitemap>\n";
    xml += `    <loc>${BASE_URL}/${file}</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += "  </sitemap>\n";
  }
  xml += "</sitemapindex>\n";
  return xml;
};

const chunk = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

async function fetchJson(pathname) {
  const url = `${API_BASE}/${pathname.replace(/^\/+/, "")}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}`);
  }
  return response.json();
}

async function fetchAllProducts() {
  const firstPage = await fetchJson("all/products?page=1&limit=20");
  const firstProducts = Array.isArray(firstPage?.getAllProducts)
    ? firstPage.getAllProducts
    : [];
  const totalPages = Math.max(Number(firstPage?.pagination?.totalPages) || 1, 1);

  if (totalPages === 1) return firstProducts;

  const pages = [];
  for (let page = 2; page <= totalPages; page += 1) {
    pages.push(page);
  }

  const results = [...firstProducts];
  for (const batch of chunk(pages, 10)) {
    const responses = await Promise.all(
      batch.map((page) => fetchJson(`all/products?page=${page}&limit=20`))
    );
    for (const payload of responses) {
      if (Array.isArray(payload?.getAllProducts)) {
        results.push(...payload.getAllProducts);
      }
    }
  }

  return results;
}

function buildStaticPageUrls() {
  return [
    { loc: `${BASE_URL}/`, lastmod: TODAY, changefreq: "daily", priority: "1.0" },
    { loc: `${BASE_URL}/about`, lastmod: TODAY, changefreq: "monthly", priority: "0.7" },
    { loc: `${BASE_URL}/all-products`, lastmod: TODAY, changefreq: "daily", priority: "0.9" },
    { loc: `${BASE_URL}/brands`, lastmod: TODAY, changefreq: "weekly", priority: "0.8" },
    { loc: `${BASE_URL}/privacy`, lastmod: TODAY, changefreq: "yearly", priority: "0.3" },
    { loc: `${BASE_URL}/shipping-returns`, lastmod: TODAY, changefreq: "yearly", priority: "0.4" },
    { loc: `${BASE_URL}/terms`, lastmod: TODAY, changefreq: "yearly", priority: "0.3" },
  ];
}

function buildProductUrls(products) {
  const urls = [];
  const seen = new Set();

  for (const product of products) {
    if (!product?.name) continue;
    if (product?.hide === true || product?.excluded === true) continue;

    const slug = slugify(product.name);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);

    urls.push({
      loc: `${BASE_URL}/products/${slug}`,
      lastmod: toDate(product.updatedAt || product.createdAt),
      changefreq: "weekly",
      priority: "0.8",
    });
  }

  return urls;
}

function buildTaxonomyUrls(items, routePrefix, selector) {
  const urls = [];
  const seen = new Set();

  for (const item of items || []) {
    const value = selector(item);
    const normalized = String(value || "").trim();
    if (!normalized) continue;

    const encoded = encodeURIComponent(normalized);
    if (seen.has(encoded)) continue;
    seen.add(encoded);

    urls.push({
      loc: `${BASE_URL}/${routePrefix}/${encoded}`,
      lastmod: TODAY,
      changefreq: "weekly",
      priority: "0.7",
    });
  }

  return urls;
}

async function main() {
  const publicDir = path.join(__dirname, "../public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  try {
    const [products, brands, categories, fragrances] = await Promise.all([
      fetchAllProducts(),
      fetchJson("all/brands"),
      fetchJson("all/category"),
      fetchJson("all/fragrance"),
    ]);

    const pagesUrls = buildStaticPageUrls();
    const productUrls = buildProductUrls(products);
    const brandUrls = buildTaxonomyUrls(brands, "brands", (item) => item?.name);
    const categoryUrls = buildTaxonomyUrls(categories, "categories", (item) => item?.name);
    const fragranceUrls = buildTaxonomyUrls(
      fragrances,
      "fragrance",
      (item) => item?.type || item?.family
    );
    const appealUrls = buildTaxonomyUrls(
      [{ name: "men" }, { name: "women" }, { name: "unisex" }],
      "appeal",
      (item) => item?.name
    );

    const files = [
      ["sitemap-pages.xml", pagesUrls],
      ["sitemap-products.xml", productUrls],
      ["sitemap-brands.xml", brandUrls],
      ["sitemap-categories.xml", categoryUrls],
      ["sitemap-fragrance.xml", fragranceUrls],
      ["sitemap-appeal.xml", appealUrls],
    ];

    for (const [filename, urls] of files) {
      fs.writeFileSync(path.join(publicDir, filename), xmlUrlset(urls), "utf8");
    }

    const sitemapIndexFiles = files.map(([filename]) => filename);
    fs.writeFileSync(
      path.join(publicDir, "sitemap.xml"),
      xmlSitemapIndex(sitemapIndexFiles),
      "utf8"
    );

    console.log(`Generated ${sitemapIndexFiles.length} sitemap files.`);
    console.log(`Products indexed: ${productUrls.length}`);
    console.log(`Brands indexed: ${brandUrls.length}`);
    console.log(`Categories indexed: ${categoryUrls.length}`);
    console.log(`Fragrance pages indexed: ${fragranceUrls.length}`);
  } catch (error) {
    console.error("Sitemap generation failed:", error.message);
    process.exitCode = 1;
  }
}

main();
