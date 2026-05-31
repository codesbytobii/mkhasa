
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.mkhasa.com';

// Helper function to generate sitemap XML
const generateUrlset = (urls) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    if (url.changefreq) xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    if (url.priority) xml += `    <priority>${url.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  return xml;
};

// Static pages
const pages = [
  { loc: `${BASE_URL}/`, lastmod: '2025-12-23', changefreq: 'daily', priority: '1.0' },
  { loc: `${BASE_URL}/about`, lastmod: '2025-12-23', changefreq: 'monthly', priority: '0.8' },
  { loc: `${BASE_URL}/contact`, lastmod: '2025-12-23', changefreq: 'monthly', priority: '0.7' },
  { loc: `${BASE_URL}/categories`, lastmod: '2025-12-23', changefreq: 'weekly', priority: '0.8' },
];

// Generate static sitemaps
fs.writeFileSync(
  path.join(__dirname, '../public/sitemap-pages.xml'),
  generateUrlset(pages)
);

// Create empty sitemaps for other categories
const sitemaps = [
  'sitemap-pages.xml',
  'sitemap-products.xml',
  'sitemap-perfumes.xml',
  'sitemap-New.xml',
  'sitemap-contact.xml',
  'sitemap-bodysprays.xml',
  'sitemap-discount.xml',
  'sitemap-fragrancefamily.xml'
];

// Generate main index
let indexXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
indexXml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

sitemaps.forEach(sitemap => {
  indexXml += '  <sitemap>\n';
  indexXml += `    <loc>${BASE_URL}/${sitemap}</loc>\n`;
  indexXml += `    <lastmod>2025-12-23</lastmod>\n`;
  indexXml += '  </sitemap>\n';
});

indexXml += '</sitemapindex>';

fs.writeFileSync(
  path.join(__dirname, '../public/sitemap.xml'),
  indexXml
);

// Create empty sitemaps for now
sitemaps.forEach(sitemap => {
  if (sitemap !== 'sitemap-pages.xml') {
    fs.writeFileSync(
      path.join(__dirname, `../public/${sitemap}`),
      generateUrlset([])
    );
  }
});

console.log('✅ Static sitemaps generated!');
console.log('⚠️ Note: Product sitemaps are empty. Update the script to fetch from API.');