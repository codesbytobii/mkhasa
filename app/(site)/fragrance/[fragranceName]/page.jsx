import { createPageMetadata, formatSlugForTitle } from "@/seo/nextMetadata";
import { noIndexMetadata } from "@/seo/noIndexMetadata";
import { getFragranceProductsServerData } from "@/seo/serverData";
import { toFragrancePath } from "@/utils/paths";
import { notFound } from "next/navigation";
import FragrancePageClient from "./page.client";

export async function generateMetadata({ params }) {
  const raw = Array.isArray(params?.fragranceName)
    ? params.fragranceName[0]
    : params?.fragranceName || "";
  if (!raw) return noIndexMetadata;

  const fragranceName = formatSlugForTitle(raw) || "Fragrance";
  const fragranceData = await getFragranceProductsServerData(raw, 1);

  if (!fragranceData) {
    return createPageMetadata({
      title: `${fragranceName} Fragrances | Mkhasa`,
      description: `Browse ${fragranceName.toLowerCase()} fragrances at Mkhasa.`,
      path: toFragrancePath(raw),
      keywords: [`${fragranceName} fragrance`, "perfume collection", "mkhasa nigeria"],
      robots: noIndexMetadata.robots,
    });
  }

  const productCount = fragranceData?.totalProducts || 0;

  return createPageMetadata({
    title: `${fragranceName} Fragrances | Mkhasa`,
    description: `Discover ${fragranceName.toLowerCase()} fragrances at Mkhasa. ${productCount}+ authentic scents with fast delivery across Nigeria.`,
    path: toFragrancePath(raw),
    keywords: [`${fragranceName} fragrance`, "perfume collection", "mkhasa nigeria"],
  });
}

export default async function FragrancePage({ params }) {
  const raw = Array.isArray(params?.fragranceName)
    ? params.fragranceName[0]
    : params?.fragranceName || "";
  if (!raw) notFound();

  const fragranceData = await getFragranceProductsServerData(raw, 1);

  return (
    <>
      <h1 className="sr-only">
        {formatSlugForTitle(raw) || "Fragrance"} fragrance products
      </h1>
      <FragrancePageClient
        initialFragranceName={raw}
        initialFragranceData={fragranceData}
      />
    </>
  );
}
