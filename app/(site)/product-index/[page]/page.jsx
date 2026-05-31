import Link from "next/link";
import { Wrapper } from "@/components/ui/Wrapper";
import { createPageMetadata } from "@/seo/nextMetadata";
import {
  getAllProductsServerData,
  getBrandsServerData,
  getCategoriesServerData,
  getFragrancesServerData,
} from "@/seo/serverData";
import {
  toAppealPath,
  toBrandPath,
  toCategoryPath,
  toFragrancePath,
  toProductPath,
} from "@/utils/paths";
import { slugify } from "@/utils/slugify";

const PRODUCTS_PER_PAGE = 200;
const APPEALS = ["men", "women", "unisex"];

const toPositiveInt = (value) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw || "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

export async function generateMetadata({ params }) {
  const page = toPositiveInt(params?.page);
  const pageTitle =
    page === 1 ? "Product Index | Mkhasa" : `Product Index - Page ${page} | Mkhasa`;

  return createPageMetadata({
    title: pageTitle,
    description:
      "Browse crawlable internal links to Mkhasa products, brands, categories, fragrance families, and appeals.",
    path: `/product-index/${page}`,
    keywords: ["mkhasa product index", "mkhasa brands", "mkhasa categories"],
  });
}

export default async function ProductIndexPage({ params }) {
  const page = toPositiveInt(params?.page);

  const [productsData, brands, categories, fragrances] = await Promise.all([
    getAllProductsServerData(page, PRODUCTS_PER_PAGE),
    getBrandsServerData(),
    getCategoriesServerData(),
    getFragrancesServerData(),
  ]);

  const products = Array.isArray(productsData?.getAllProducts)
    ? productsData.getAllProducts
    : [];
  const totalPages = Math.max(Number(productsData?.pagination?.totalPages) || 1, 1);

  const productLinks = products
    .map((product, index) => {
      const name = product?.name || "";
      const slug = slugify(name);
      if (!slug) return null;
      return {
        key: `${slug}-${index}`,
        slug,
        name,
      };
    })
    .filter(Boolean);

  const currentPage = Math.min(page, totalPages);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <main className="py-8 bg-white">
      <Wrapper className="space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-app-black">Mkhasa Product Index</h1>
          <p className="text-sm text-gray-600">
            Crawlable index page for product and taxonomy URLs.
          </p>
        </header>

        <nav aria-label="Product index pagination" className="space-y-3">
          <div className="flex items-center flex-wrap gap-2">
            {currentPage > 1 ? (
              <Link
                href={`/product-index/${currentPage - 1}`}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                Previous
              </Link>
            ) : (
              <span className="px-3 py-1 border rounded text-gray-400">Previous</span>
            )}

            {currentPage < totalPages ? (
              <Link
                href={`/product-index/${currentPage + 1}`}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                Next
              </Link>
            ) : (
              <span className="px-3 py-1 border rounded text-gray-400">Next</span>
            )}
          </div>

          <ul className="flex flex-wrap gap-2">
            {pageNumbers.map((pageNumber) => (
              <li key={pageNumber}>
                <Link
                  href={`/product-index/${pageNumber}`}
                  aria-current={pageNumber === currentPage ? "page" : undefined}
                  className={`px-3 py-1 border rounded ${
                    pageNumber === currentPage
                      ? "bg-black text-white border-black"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {pageNumber}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-app-black">
            Product URLs (Page {currentPage} of {totalPages})
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {productLinks.map((product) => (
              <li key={product.key} className="text-sm">
                <Link
                  href={toProductPath(product.name)}
                  className="underline underline-offset-2 hover:text-app-red"
                >
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {currentPage === 1 && (
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-app-black">Taxonomy URLs</h2>

            <div className="space-y-2">
              <h3 className="font-semibold text-app-black">Brands</h3>
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {brands
                  .map((brand) => String(brand?.name || "").trim())
                  .filter(Boolean)
                  .map((brandName) => (
                    <li key={brandName}>
                      <Link
                        href={toBrandPath(brandName)}
                        className="underline underline-offset-2 hover:text-app-red"
                      >
                        {brandName}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-app-black">Categories</h3>
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {categories
                  .map((category) => String(category?.name || "").trim())
                  .filter(Boolean)
                  .map((categoryName) => (
                    <li key={categoryName}>
                      <Link
                        href={toCategoryPath(categoryName)}
                        className="underline underline-offset-2 hover:text-app-red"
                      >
                        {categoryName}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-app-black">Fragrance Types</h3>
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {fragrances
                  .map((item) => String(item?.type || item?.family || "").trim())
                  .filter(Boolean)
                  .map((fragranceName) => (
                    <li key={fragranceName}>
                      <Link
                        href={toFragrancePath(fragranceName)}
                        className="underline underline-offset-2 hover:text-app-red"
                      >
                        {fragranceName}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-app-black">Appeals</h3>
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {APPEALS.map((appeal) => (
                  <li key={appeal}>
                    <Link
                      href={toAppealPath(appeal)}
                      className="underline underline-offset-2 hover:text-app-red capitalize"
                    >
                      {appeal}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </Wrapper>
    </main>
  );
}
