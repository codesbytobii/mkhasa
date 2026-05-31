import { createPageMetadata } from "@/seo/nextMetadata";
import { getHomeServerData } from "@/seo/serverData";
import HomePageClient from "./page.client";

export const metadata = createPageMetadata({
  title: "Buy Original Perfumes in Nigeria | Affordable Luxury Fragrances - Mkhasa",
  description:
    "Shop original perfumes in Nigeria at Mkhasa. Discover long-lasting luxury fragrances for men & women at affordable prices. Fast delivery nationwide.",
  path: "/",
  keywords: [
    "original perfumes in Nigeria",
    "luxury fragrances Nigeria",
    "authentic perfumes",
    "Mkhasa",
  ],
});

export default async function Page() {
  const homeData = await getHomeServerData();
  return (
    <>
      <h1 className="sr-only">Buy original perfumes in Nigeria</h1>
      <HomePageClient initialData={homeData} />
    </>
  );
}
