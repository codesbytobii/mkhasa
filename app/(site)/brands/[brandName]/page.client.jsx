"use client";

import SingleBrandProduct from "@/app-pages/Brands/single-brand-product";

export default function SingleBrandPageClient({
  initialBrandName,
  initialBrandData,
  initialBrandDetails,
}) {
  return (
    <SingleBrandProduct
      initialBrandName={initialBrandName}
      initialBrandData={initialBrandData}
      initialBrandDetails={initialBrandDetails}
    />
  );
}
