import { useState, useEffect, useCallback } from "react";
import { toProductSlug } from "../../utils/paths";

const STORAGE_KEY = "recentlyViewedProducts";
const MAX_ITEMS = 10;

const readStorage = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeStorage = (list) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    
  }
};

const toStoredProduct = (product) => ({
  _id: product._id,
  name: product.name,
  slug: toProductSlug(product.name),
  brand: product.brand ?? null,
  category: product.category ?? null,
  mainImage: product.mainImage ?? null,
  price: product.price ?? null,
});

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