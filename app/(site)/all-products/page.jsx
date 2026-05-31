import { createPageMetadata } from "@/seo/nextMetadata";
import { getAllProductsServerData } from "@/seo/serverData";
import AllProductsPageClient from "./page.client";

export const metadata = createPageMetadata({
  title: "All Perfumes & Fragrances | Mkhasa",
  description:
    "Browse all perfumes and fragrances on Mkhasa. Shop authentic products for men and women with fast nationwide delivery.",
  path: "/all-products",
  keywords: ["all perfumes", "all fragrances", "mkhasa products"],
});

export default async function AllProductsPage() {
  const initialData = await getAllProductsServerData(1, 50);
  return (
    <>
      <h1 className="sr-only">All perfumes and fragrances</h1>
      <AllProductsPageClient initialData={initialData} />
    </>
  );
}
