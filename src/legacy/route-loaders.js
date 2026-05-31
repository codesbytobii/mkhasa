import {
  fetchProduct,
  getBestSellers,
  getCategories,
  getProducts,
} from "../utils/queryFunctions";

export async function getLayoutLoaderData() {
  try {
    const categories = (await getCategories()) || [];
    return { categories, status: "success", error: null };
  } catch (error) {
    return {
      categories: [],
      status: "error",
      error: error instanceof Error ? error : new Error("Failed to load categories"),
    };
  }
}

export async function getHomeLoaderData() {
  const [featuredProducts, latestProducts, newArrivals, bestsellers, categories] =
    await Promise.all([
      getProducts("featured/product"),
      getProducts("latest/product"),
      getBestSellers("deal/product"),
      getBestSellers("bestseller/product"),
      getCategories(),
    ]);

  return {
    featuredProducts: featuredProducts || [],
    latestProducts: latestProducts || [],
    newArrivals: newArrivals || [],
    bestsellers: bestsellers || [],
    categories: categories || [],
    status: "success",
    error: null,
  };
}

export async function getProductLoaderData(productName) {
  try {
    const product = await fetchProduct(productName);
    return { product: product || null };
  } catch {
    return { product: null };
  }
}
