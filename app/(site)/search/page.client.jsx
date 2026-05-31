"use client";

import dynamic from "next/dynamic";

const SearchComponent = dynamic(
  () => import("@/app-pages/search").then((mod) => mod.Component),
  { ssr: false }
);

export default function SearchPageClient() {
  return <SearchComponent />;
}
