
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "../../utils/axios";

export const useInfiniteProducts = (url, ...key) => {
  let initialPageData = null;
  let queryKeyParts = [...key];
  const maybeOptions = key[key.length - 1];
  if (
    maybeOptions &&
    typeof maybeOptions === "object" &&
    !Array.isArray(maybeOptions) &&
    Object.prototype.hasOwnProperty.call(maybeOptions, "__initialData")
  ) {
    initialPageData = maybeOptions.__initialData || null;
    const { __initialData, ...rest } = maybeOptions;
    queryKeyParts = [...key.slice(0, -1), rest];
  }

  const fetchProducts = async (pageParam = 1) => {
    const res = await axios.get(`${url}&page=${pageParam}`);
    return res.data;
  };

  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["product", ...queryKeyParts],
    queryFn: ({ pageParam = 1 }) => fetchProducts(pageParam),
    ...(initialPageData
      ? {
          initialData: {
            pages: [initialPageData],
            pageParams: [1],
          },
        }
      : {}),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });
};
