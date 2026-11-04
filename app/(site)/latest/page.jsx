import { createPageMetadata } from "@/seo/nextMetadata";
import LatestPageClient from "./page.client";

export async function generateMetadata() {
  return createPageMetadata({
    title: "New In: Latest Perfumes & Fragrances | Mkhasa",
    description:
      "Discover the latest authentic perfumes and fragrances on Mkhasa. Shop new arrivals with fast delivery across Nigeria.",
    path: "/latest",
    keywords: [
      "new perfumes",
      "latest fragrances",
      "new arrivals perfumes nigeria",
      "authentic perfumes nigeria",
    ],
  });
}

export default function LatestPage() {
  return (
    <>
      <h1 className="sr-only">Latest perfumes and fragrances</h1>
      <LatestPageClient />
    </>
  );
}