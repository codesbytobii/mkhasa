import { slugify } from "./slugify";

const cleanValue = (value = "") => String(value || "").trim();

export const toProductSlug = (name = "") => slugify(cleanValue(name));

export const toProductPath = (name = "") => {
  const slug = toProductSlug(name);
  return slug ? `/products/${slug}` : "/products";
};

export const toBrandPath = (name = "") => {
  const value = cleanValue(name);
  return value ? `/brands/${encodeURIComponent(value)}` : "/brands";
};

export const toCategoryPath = (name = "") => {
  const value = cleanValue(name);
  return value ? `/categories/${encodeURIComponent(value)}` : "/categories";
};

export const toFragrancePath = (name = "") => {
  const value = cleanValue(name);
  return value ? `/fragrance/${encodeURIComponent(value)}` : "/fragrance";
};

export const toAppealPath = (name = "") => {
  const value = cleanValue(name).toLowerCase();
  return value ? `/appeal/${encodeURIComponent(value)}` : "/appeal";
};
