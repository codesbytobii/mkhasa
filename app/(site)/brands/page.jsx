import { createPageMetadata } from "@/seo/nextMetadata";
import { getBrandsServerData } from "@/seo/serverData";
import BrandsPageClient from "./page.client";

export const metadata = createPageMetadata({
  title: "All Perfume & Fragrance Brands | Mkhasa",
  description:
    "Explore fragrance brands available at Mkhasa. Shop authentic perfumes from top brands with fast shipping across Nigeria.",
  path: "/brands",
  keywords: ["perfume brands", "fragrance brands", "mkhasa brands"],
});

export default async function BrandsPage() {
  const initialBrands = await getBrandsServerData();
  return (
    <>
      <h1 className="sr-only">Perfume and fragrance brands</h1>
      <BrandsPageClient initialBrands={initialBrands} />
    </>
  );
}
