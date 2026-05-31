"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const useAppeal = ({ initialData = null, initialAppealName = "" } = {}) => {
  const { appealName: routeAppealName } = useParams();
  const resolvedAppealName = initialAppealName || routeAppealName || "";

  const [currentPage, setCurrentPage] = useState(initialData?.currentPage || 1);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages || 1);
  const [hasNextPage, setHasNextPage] = useState(Boolean(initialData?.hasNextPage));
  const [hasPreviousPage, setHasPreviousPage] = useState(Boolean(initialData?.hasPreviousPage));
  const [displayedProducts, setDisplayedProducts] = useState(() => initialData?.products || []);
  const [sorted, setSorted] = useState("");
  const [initialApplied, setInitialApplied] = useState(Boolean(initialData?.products?.length));

  const { data: appealProducts, isFetching: fetchingAppeal } = useQuery({
    queryKey: ["appealProducts", resolvedAppealName, sorted, currentPage],
    queryFn: async () => {
      const url = sorted
        ? `${BASE_URL}/product/appeal/${sorted}/${resolvedAppealName}?page=${currentPage}`
        : `${BASE_URL}/product/appeal/${resolvedAppealName}?page=${currentPage}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch appeal products");
      return res.json();
    },
    enabled: Boolean(resolvedAppealName) && !initialApplied,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (initialApplied) { setInitialApplied(false); return; }
    if (!appealProducts) return;
    setDisplayedProducts(appealProducts?.products || []);
    setCurrentPage(appealProducts?.currentPage || 1);
    setTotalPages(appealProducts?.totalPages || 1);
    setHasNextPage(Boolean(appealProducts?.hasNextPage));
    setHasPreviousPage(Boolean(appealProducts?.hasPreviousPage));
  }, [appealProducts]);

  const handleSort = (text) => { setSorted(text === "all" ? "" : text); setCurrentPage(1); };
  const handleNextPage = () => setCurrentPage((p) => p + 1);
  const handlePrevPage = () => setCurrentPage((p) => p - 1);

  const sorts = [
    { name: "Latest", part: "latest" },
    { name: "Lowest to Highest", part: "lowestPrice" },
    { name: "Highest to lowest", part: "highestPrice" },
  ];

  return { displayedProducts, fetchingAppeal, appealName: resolvedAppealName, sorts, appealProducts, currentPage, hasNextPage, hasPreviousPage, totalPages, handleSort, handleNextPage, handlePrevPage };
};

export default useAppeal;
