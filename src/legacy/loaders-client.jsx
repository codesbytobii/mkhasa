"use client";

/**
 * Thin client-side data providers that pass server-fetched initialData
 * into the LoaderDataContext consumed by legacy page components via useLoaderData().
 *
 * These exist so server components (page.jsx) can pass pre-fetched data to
 * client page components without requiring client-side re-fetching on mount.
 */

import { LoaderDataProvider } from "./router-shim.jsx";

export function HomeLoaderProvider({ children, initialData = {} }) {
  return (
    <LoaderDataProvider value={initialData}>
      {children}
    </LoaderDataProvider>
  );
}

export function ProductLoaderProvider({ children, initialData = {} }) {
  return (
    <LoaderDataProvider value={initialData}>
      {children}
    </LoaderDataProvider>
  );
}
