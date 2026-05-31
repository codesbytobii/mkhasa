import axios from "./axios";

export async function getProducts(url) {
  try {
    const response = await axios.get(url, {
      headers: { "Content-Type": "application/json" },
    });
    return response?.data?.map((x) => {
      return {
        id: x?._id,
        product: x?.name,
        category: x?.category,
        originalPrice: x?.price,
        image: x?.mainImage,
        available: x?.available
      };
    });
  } catch (error) {
    console.error(error);
    // throw new Error("Failed to get featured products");
  }
}

export async function getBestSellers(url) {
  try {
    const response = await axios.get(url, {
      headers: { "Content-Type": "application/json" },
    });
    return response?.data?.map((x) => {
      return {
        id: x?.product?._id,
        product: x?.product?.name,
        category: x?.product?.category,
        originalPrice: x?.product?.price,
        image: x?.product?.mainImage,
      };
    });
  } catch (error) {
    console.error(error);
    // throw new Error("Failed to get featured products");
  }
}

export async function getCategories() {
  const response = await axios.get(`all/category`);
  return response?.data;
}

export const fetchProducts = async (url, pageParam) => {
  const res = await axios.get(`${url}?page=` + pageParam);
  return res.data;
};

export const fetchProduct = async (productName) => {
  const res = await axios.get(`product/name/${productName.replaceAll("-", ' ')}`);
  return res.data.product;
};
