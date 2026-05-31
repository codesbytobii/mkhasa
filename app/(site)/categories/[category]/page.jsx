import { createPageMetadata, formatSlugForTitle } from "@/seo/nextMetadata";
import { noIndexMetadata } from "@/seo/noIndexMetadata";
import { getCategoryProductsServerData } from "@/seo/serverData";
import { toCategoryPath } from "@/utils/paths";
import { notFound } from "next/navigation";
import CategoryPageClient from "./page.client";

export async function generateMetadata({ params }) {
  const raw = Array.isArray(params?.category) ? params.category[0] : params?.category || "";
  if (!raw) return noIndexMetadata;

  const categoryName = formatSlugForTitle(raw) || "Perfume";
  const categoryData = await getCategoryProductsServerData(raw, 1);

  if (!categoryData) {
    return createPageMetadata({
      title: `${categoryName} Perfumes & Fragrances | Mkhasa`,
      description: `Browse ${categoryName.toLowerCase()} fragrances at Mkhasa.`,
      path: toCategoryPath(raw),
      keywords: [`${categoryName} perfumes`, `${categoryName} fragrances`, "authentic perfumes nigeria"],
      robots: noIndexMetadata.robots,
    });
  }

  const productCount = categoryData?.totalProducts || 0;

  return createPageMetadata({
    title: `${categoryName} Perfumes & Fragrances | Mkhasa`,
    description: `Shop authentic ${categoryName.toLowerCase()} perfumes and fragrances on Mkhasa. ${productCount}+ products with fast delivery across Nigeria.`,
    path: toCategoryPath(raw),
    keywords: [`${categoryName} perfumes`, `${categoryName} fragrances`, "authentic perfumes nigeria"],
  });
}

export default async function CategoryPage({ params }) {
  const raw = Array.isArray(params?.category) ? params.category[0] : params?.category || "";
  if (!raw) notFound();

  const categoryData = await getCategoryProductsServerData(raw, 1);

  return (
    <>
      <h1 className="sr-only">
        {formatSlugForTitle(raw) || "Category"} perfumes and fragrances
      </h1>
      <CategoryPageClient
        initialCategoryName={raw}
        initialCategoryData={categoryData}
      />
    </>
  );
}
