"use client";

import dynamic from "next/dynamic";

const ProductPageComponent = dynamic(
  () => import("@/app-pages/select-product").then((mod) => mod.Component),
  { ssr: false }
);

export default function ProductPageClient({ initialProduct }) {
  return <ProductPageComponent initialProduct={initialProduct} />;
}
