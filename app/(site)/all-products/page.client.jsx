"use client";

import { Component as AllProductsComponent } from "@/app-pages/all-products";

export default function AllProductsPageClient({ initialData }) {
  return <AllProductsComponent initialData={initialData} />;
}
