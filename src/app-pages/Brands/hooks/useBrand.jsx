"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const useBrand = ({ initialData = null, initialBrandName = "" } = {}) => {
  const { brandName: routeBrandName } = useParams();
  const resolvedBrandName = initialBrandName || routeBrandName || "";

  const [displayedProducts, setDisplayedProducts] = useState(() => initialData?.products || []);
  const [currentPage, setCurrentPage] = useState(initialData?.currentPage || 1);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages || 1);
  const [sorted, setSorted] = useState("");
  const [initialApplied, setInitialApplied] = useState(Boolean(initialData?.products?.length));
  const observerRef = useRef(null);

  const { data: brandsProductsData, isFetching: fetchingBrand } = useQuery({
    queryKey: ["brandProducts", resolvedBrandName, sorted, currentPage],
    queryFn: async () => {
      const decoded = decodeURIComponent(resolvedBrandName).trim();
      const url = sorted
        ? `${BASE_URL}/product/brand/${sorted}/${decoded}?page=${currentPage}`
        : `${BASE_URL}/product/brand/${decoded}?page=${currentPage}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch brand products");
      return res.json();
    },
    enabled: Boolean(resolvedBrandName) && !initialApplied,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (initialApplied) { setInitialApplied(false); return; }
    if (!brandsProductsData) return;
    if (currentPage > 1) {
      setDisplayedProducts((prev) => [...prev, ...(brandsProductsData.products || [])]);
    } else {
      setDisplayedProducts(brandsProductsData.products || []);
    }
    setTotalPages(brandsProductsData.totalPages || 1);
  }, [brandsProductsData]);

  const handleSort = (text) => { setSorted(text === "all" ? "" : text); setCurrentPage(1); setDisplayedProducts([]); };

  const lastProductRef = useCallback((node) => {
    if (fetchingBrand) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && currentPage < totalPages) setCurrentPage((p) => p + 1);
    });
    if (node) observerRef.current.observe(node);
  }, [fetchingBrand, currentPage, totalPages]);

  const sorts = [
    { name: "Latest", part: "latest" },
    { name: "Lowest to Highest", part: "lowestPrice" },
    { name: "Highest to lowest", part: "highestPrice" },
  ];

  return { displayedProducts, brandName: resolvedBrandName, brandsProducts: displayedProducts, brandsProductsData, sorts, lastProductRef, handleSort, fetchingBrand, currentPage, totalPages };
};

export default useBrand;
