import { useState, useEffect, useCallback } from "react";
import { toProductSlug } from "../../utils/paths";

const STORAGE_KEY = "recentlyViewedProducts";
const MAX_ITEMS = 10;

/**
 * Reads the recently viewed list from localStorage.
 * Returns an empty array on any failure (SSR, quota errors, etc.)
 */
const readStorage = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Writes the list to localStorage.
 */
const writeStorage = (list) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // quota exceeded or private browsing – fail silently
  }
};

/**
 * Picks only the lightweight fields we want to persist.
 */
const toStoredProduct = (product) => ({
  _id: product._id,
  name: product.name,
  slug: toProductSlug(product.name),
  brand: product.brand ?? null,
  category: product.category ?? null,
  mainImage: product.mainImage ?? null,
  price: product.price ?? null,
});

/**
 * useRecentlyViewed
 *
 * Call this once per product page.
 *
 * @param {object|null} product – the current product object (from state/props)
 * @returns {object[]} recentlyViewed – the stored list, excluding the current product,
 *                                      newest first, max 10 items
 */
export function useRecentlyViewed(product) {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Save the current product whenever it changes (i.e. when product data arrives)
  useEffect(() => {
    if (!product?._id) return;

    const stored = readStorage();

    // Remove any existing record for this product (dedup)
    const filtered = stored.filter((p) => p._id !== product._id);

    // Prepend the current product
    const updated = [toStoredProduct(product), ...filtered];

    // Enforce max 10
    const trimmed = updated.slice(0, MAX_ITEMS);

    writeStorage(trimmed);

    // Expose the list *excluding* the current product so the UI row
    // doesn't show the page the user is already on
    setRecentlyViewed(trimmed.filter((p) => p._id !== product._id));
  }, [product?._id]);

  return recentlyViewed;
}