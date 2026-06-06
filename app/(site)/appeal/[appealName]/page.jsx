import { createPageMetadata, formatSlugForTitle } from "@/seo/nextMetadata";
import { noIndexMetadata } from "@/seo/noIndexMetadata";
import { getAppealProductsServerData } from "@/seo/serverData";
import { toAppealPath } from "@/utils/paths";
import { notFound } from "next/navigation";
import AppealPageClient from "./page.client";

export async function generateMetadata({ params }) {
  const raw = Array.isArray(params?.appealName) ? params.appealName[0] : params?.appealName || "";
  if (!raw) return noIndexMetadata;

  const appealName = formatSlugForTitle(raw) || "Fragrance";
  const appealData = await getAppealProductsServerData(raw, 1);

  if (!appealData) {
    return createPageMetadata({
      title: `${appealName} Perfumes & Fragrances | Mkhasa`,
      description: `Browse ${appealName.toLowerCase()} fragrances at Mkhasa.`,
      path: toAppealPath(raw),
      keywords: [`${appealName} perfume`, `${appealName} fragrance`, "mkhasa appeal collection"],
      robots: noIndexMetadata.robots,
    });
  }

  const productCount = appealData?.totalProducts || 0;

  return createPageMetadata({
    title: `${appealName} Perfumes & Fragrances | Mkhasa`,
    description: `Explore ${appealName.toLowerCase()} perfumes and fragrances on Mkhasa. ${productCount}+ authentic products with fast nationwide delivery.`,
    path: toAppealPath(raw),
    keywords: [`${appealName} perfume`, `${appealName} fragrance`, "mkhasa appeal collection"],
  });
}

export default async function AppealPage({ params }) {
  const raw = Array.isArray(params?.appealName) ? params.appealName[0] : params?.appealName || "";
  if (!raw) notFound();

  const appealData = await getAppealProductsServerData(raw, 1, 20);

  return (
    <>
      <h1 className="sr-only">
        {formatSlugForTitle(raw) || "Appeal"} perfumes and fragrances
      </h1>
      <AppealPageClient
        initialAppealName={raw}
        initialAppealData={appealData}
      />
    </>
  );
}
