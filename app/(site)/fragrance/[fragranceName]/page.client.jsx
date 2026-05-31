"use client";

import FragranceTypeProductsPage from "@/app-pages/fragrance/FragranceTypeProducts";

export default function FragrancePageClient({ initialFragranceName, initialFragranceData }) {
  return (
    <FragranceTypeProductsPage
      initialFragranceName={initialFragranceName}
      initialFragranceData={initialFragranceData}
    />
  );
}
