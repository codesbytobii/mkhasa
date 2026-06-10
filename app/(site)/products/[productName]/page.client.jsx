"use client";

import { Component as ProductPageComponent } from "@/app-pages/select-product";

export default function ProductPageClient({
  initialProduct,
  initialSeriesProducts,
  initialExploreBrands,
}) {
  return (
    <ProductPageComponent
      initialProduct={initialProduct}
      initialSeriesProducts={initialSeriesProducts}
      initialExploreBrands={initialExploreBrands}
    />
  );
}