import { createPageMetadata } from "@/seo/nextMetadata";
import { noIndexMetadata } from "@/seo/noIndexMetadata";
import SearchPageClient from "./page.client";

export async function generateMetadata({ searchParams }) {
  const query = searchParams?.s || "";
  if (!query) return noIndexMetadata;
  return createPageMetadata({
    title: `Search results for "${query}" | Mkhasa`,
    description: `Browse search results for "${query}" on Mkhasa. Find authentic perfumes and fragrances with fast delivery across Nigeria.`,
    path: `/search?s=${encodeURIComponent(query)}`,
  });
}

export default function SearchPage() {
  return <SearchPageClient />;
}
