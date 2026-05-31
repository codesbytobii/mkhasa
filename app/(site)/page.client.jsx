"use client";

import { HomeLoaderProvider } from "@/legacy/loaders-client";
import { Component as HomePageComponent } from "@/app-pages/Home/home";

export default function HomePageClient({ initialData }) {
  return (
    <HomeLoaderProvider initialData={initialData}>
      <HomePageComponent />
    </HomeLoaderProvider>
  );
}
