/**
 * Standalone product API utilities.
 * Replaces the legacy ProductContext — no provider wrapping needed.
 */

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || "";

export async function getSingleProduct(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getSingleSeries(seriesName) {
  try {
    const res = await fetch(`${API_BASE}/all/series`);
    if (!res.ok) return null;
    const list = await res.json();
    return Array.isArray(list)
      ? list.find((s) => s.name === seriesName) ?? null
      : null;
  } catch {
    return null;
  }
}
