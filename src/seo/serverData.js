const DEFAULT_API_BASE = "https://mkhasa-bfdb6fabd978.herokuapp.com/api/v1";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL ||
  DEFAULT_API_BASE
).replace(/\/$/, "");

const DEFAULT_REVALIDATE_SECONDS = 300;

const safeDecode = (value = "") => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const buildUrl = (path) => {
  const normalized = String(path || "").replace(/^\/+/, "");
  return `${API_BASE_URL}/${normalized}`;
};

async function apiGet(path, revalidate = DEFAULT_REVALIDATE_SECONDS) {
  try {
    const response = await fetch(buildUrl(path), {
      next: { revalidate },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

const mapProductCards = (items = []) =>
  (Array.isArray(items) ? items : []).map((item) => ({
    id: item?._id,
    product: item?.name,
    name: item?.name,
    category: item?.category,
    originalPrice: item?.price,
    discountedPrice: item?.discountedPrice,
    image: item?.mainImage,
    available: item?.available,
  }));

const mapDealCards = (items = []) =>
  (Array.isArray(items) ? items : []).map((entry) => {
    const product = entry?.product || {};
    return {
      id: product?._id,
      product: product?.name,
      name: product?.name,
      category: product?.category,
      originalPrice: product?.price,
      discountedPrice: product?.discountedPrice,
      image: product?.mainImage,
      available: product?.available,
      price: product?.price,
    };
  });

export async function getHomeServerData() {
  const [featuredRaw, latestRaw, dealsRaw, bestRaw, categoriesRaw, fragranceRaw] =
    await Promise.all([
      apiGet("featured/product"),
      apiGet("latest/product"),
      apiGet("deal/product"),
      apiGet("bestseller/product"),
      apiGet("all/category"),
      apiGet("all/fragrance"),
    ]);

  const defaultFragrance = fragranceRaw?.[0]?.type || "arabian";
  const fragranceProductsRaw = await apiGet(
    `product/fragrance/${encodeURIComponent(defaultFragrance)}`
  );

  return {
    featuredProducts: mapProductCards(featuredRaw),
    latestProducts: mapProductCards(latestRaw),
    newArrivals: mapDealCards(dealsRaw),
    bestsellers: mapDealCards(bestRaw),
    categories: Array.isArray(categoriesRaw) ? categoriesRaw : [],
    nicheFragranceTypes: Array.isArray(fragranceRaw) ? fragranceRaw : [],
    nicheProducts: Array.isArray(fragranceProductsRaw?.products)
      ? fragranceProductsRaw.products
      : [],
    status: "success",
    error: null,
  };
}

export async function getAllProductsServerData(page = 1, limit = 50) {
  const data = await apiGet(
    `all/products?page=${Number(page) || 1}&limit=${Number(limit) || 50}`
  );
  return {
    getAllProducts: Array.isArray(data?.getAllProducts) ? data.getAllProducts : [],
    pagination: data?.pagination || { currentPage: 1, totalPages: 1 },
  };
}

export async function getBrandsServerData() {
  const data = await apiGet("all/brands");
  return Array.isArray(data) ? data : [];
}

export async function getCategoriesServerData() {
  const data = await apiGet("all/category");
  return Array.isArray(data) ? data : [];
}

export async function getFragrancesServerData() {
  const data = await apiGet("all/fragrance");
  return Array.isArray(data) ? data : [];
}

export async function getBrandProductsServerData(brandName, page = 1) {
  const decoded = safeDecode(brandName).trim();
  if (!decoded) return null;
  return await apiGet(
    `product/brand/${encodeURIComponent(decoded)}?page=${Number(page) || 1}`
  );
}

export async function getCategoryProductsServerData(categoryName, page = 1, pageSize = 20) {
  const decoded = safeDecode(categoryName).trim();
  if (!decoded) return null;
  // return await apiGet(
  //   `product/category/${encodeURIComponent(decoded)}?page=${Number(page) || 1}`
  // );
  return await apiGet(
    `product/category/${encodeURIComponent(decoded)}?page=${page}&pageSize=${pageSize}`
  );
}

export async function getAppealProductsServerData(appealName, page = 1, pageSize = 20) {
  const decoded = safeDecode(appealName).trim();
  if (!decoded) return null;
  // return await apiGet(
  //   `product/appeal/${encodeURIComponent(decoded)}?page=${Number(page) || 1}`
  // );
  return await apiGet(
    `product/appeal/${encodeURIComponent(decoded)}?page=${page}&pageSize=${pageSize}`
  );
}

export async function getFragranceProductsServerData(fragranceName, page = 1) {
  const decoded = safeDecode(fragranceName).trim();
  if (!decoded) return null;
  return await apiGet(
    `product/fragrance/${encodeURIComponent(decoded)}?page=${Number(page) || 1}`
  );
}

export async function getProductServerData(productSlug) {
  const decoded = safeDecode(productSlug);
  const withSpaces = decoded.replace(/-/g, " ").trim();
  if (!withSpaces) return null;
  const data = await apiGet(`product/name/${encodeURIComponent(withSpaces)}`);
  return data?.product || null;
}
