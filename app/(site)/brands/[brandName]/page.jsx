import { createPageMetadata, formatSlugForTitle } from "@/seo/nextMetadata";
import { noIndexMetadata } from "@/seo/noIndexMetadata";
import { getBrandProductsServerData } from "@/seo/serverData";
import { toBrandPath } from "@/utils/paths";
import { notFound } from "next/navigation";
import SingleBrandPageClient from "./page.client";

export async function generateMetadata({ params }) {
  const raw = Array.isArray(params?.brandName) ? params.brandName[0] : params?.brandName || "";
  if (!raw) return noIndexMetadata;

  const brandName = formatSlugForTitle(raw) || "Brand";
  const brandData = await getBrandProductsServerData(raw, 1);

  if (!brandData) {
    return createPageMetadata({
      title: `${brandName} Perfumes & Fragrances | Mkhasa`,
      description: `Browse ${brandName} fragrances at Mkhasa.`,
      path: toBrandPath(raw),
      keywords: [`${brandName} perfume`, `${brandName} fragrance`, "mkhasa brands"],
      robots: noIndexMetadata.robots,
    });
  }

  const productCount = brandData?.totalProducts || 0;

  return createPageMetadata({
    title: `${brandName} Perfumes & Fragrances | Mkhasa`,
    description: `Shop ${brandName} perfumes and fragrances at Mkhasa. ${productCount}+ authentic products with fast shipping nationwide.`,
    path: toBrandPath(raw),
    keywords: [`${brandName} perfume`, `${brandName} fragrance`, "mkhasa brands"],
  });
}

export default async function SingleBrandPage({ params }) {
  const raw = Array.isArray(params?.brandName) ? params.brandName[0] : params?.brandName || "";
  if (!raw) notFound();

  const brandData = await getBrandProductsServerData(raw, 1);

  return (
    <>
      <h1 className="sr-only">
        {formatSlugForTitle(raw) || "Brand"} perfumes and fragrances
      </h1>
      <SingleBrandPageClient
        initialBrandName={raw}
        initialBrandData={brandData}
        initialBrandDetails={brandData}
      />
    </>
  );
}
