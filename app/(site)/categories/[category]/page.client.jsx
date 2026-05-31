"use client";

import { Component as CategoryComponent } from "@/app-pages/category";

export default function CategoryPageClient({ initialCategoryName, initialCategoryData }) {
  return (
    <CategoryComponent
      initialCategoryName={initialCategoryName}
      initialCategoryData={initialCategoryData}
    />
  );
}
