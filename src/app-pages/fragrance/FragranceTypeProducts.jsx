"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Wrapper } from "../../components/ui/Wrapper";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
import { ListGrid } from "../../components/ui/ListGrid";
import { Product } from "../../components/ProductCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import NoResult from "../../components/NoResult";

const FragranceTypeProductsPage = ({
  initialFragranceName = "",
  initialFragranceData = null,
}) => {
  const params = useParams();
  const fragranceName = initialFragranceName || params?.fragranceName;
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const [fragranceProducts, setfragranceProducts] = useState(
    () => initialFragranceData?.products || []
  );
  const [fragranceData, setfragranceData] = useState(initialFragranceData || []);
  const [currentPage, setCurrentPage] = useState(initialFragranceData?.currentPage || 1);
  const [totalPages, setTotalPages] = useState(initialFragranceData?.totalPages || 1);
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(!initialFragranceData?.products?.length);


  const observerRef = useRef(null);
  const sorts = [
    { name: "Latest", part: "latest" },
    { name: "Lowest to Highest", part: "lowestPrice" },
    { name: "Highest to Lowest", part: "highestPrice" },
    { name: "Men", part: "men" },
    { name: "Women", part: "women" },
    { name: "Unisex", part: "unisex" },
  ];

  const fetchfragranceProducts = async (page = 1, canLoad = true) => {
    if (loading || (totalPages && page > totalPages)) return;
    if (canLoad) setLoading(true);
    try {
      const response = await axios(
        `${baseURL}/product/fragrance/${fragranceName}?page=${page}`
      );
      const data = response?.data;
      setfragranceData(data);
      setfragranceProducts((prev) => [...prev, ...data.products]); // Append new products
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (text) => {
    setSort(text);
    setfragranceProducts([]); // Reset product list when sorting changes
    setCurrentPage(1);
    fetchSortedfragranceProducts(1, text);
  };

  const fetchSortedfragranceProducts = async (page = 1, text) => {
    let requestUrl;
    const sort = text;
    if (["men", "women", "unisex"].includes(sort)) {
      requestUrl = `${baseURL}/product/fragrance/${fragranceName}/appeal/${sort}?page=${page}`;
    } else {
      requestUrl = `${baseURL}/product/fragrance/${sort}/${fragranceName}?page=${page}`;
    }
    setLoading(true);
    try {
      const response = await axios(requestUrl);
      const data = response?.data;
      setfragranceProducts((prev) => [...prev, ...data.products]);
      setTotalPages(data.totalPages);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialFragranceData?.products?.length) return;
    fetchfragranceProducts(currentPage);
  }, [initialFragranceData, currentPage]);

  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && currentPage < totalPages) {
          fetchfragranceProducts(currentPage + 1, false);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, currentPage, totalPages]
  );

  return (
    <Wrapper>
      <section className="mb-8 flex-wrap flex gap-4 justify-between items-center">
        <span>
          {fragranceData?.totalProducts}{" "}
          <span className="font-bold">Results</span> for {fragranceName}
        </span>
        <Select onValueChange={handleSort}>
          <SelectTrigger className="flex items-center justify-between w-[200px] border px-4 py-2 rounded-md shadow-sm focus:outline-none">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            {sorts.map((sort, index) => (
              <SelectItem value={sort.part} key={index}>
                {sort.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <section>
          {
            fragranceProducts && fragranceProducts?.length > 0 ? (
              <ListGrid>
                {fragranceProducts?.map(
                  (
                    {
                      product,
                      name,
                      category,
                      price,
                      discountedPrice,
                      mainImage,
                      _id,
                      available
                    },
                    index
                  ) => (
                    <li
                      key={index}
                      className="min-w-[11rem] md:min-w-[13rem]"
                      ref={
                        index === fragranceProducts?.length - 4 ? lastProductRef : null
                      }
                    >
                      <Product
                        id={_id}
                        name={name}
                        product={product}
                        category={category}
                        originalPrice={price}
                        discountedPrice={discountedPrice}
                        image={mainImage}
                        available={available}
                      />
                    </li>
                  )
                )}
              </ListGrid>
            ) : (
              <NoResult />
            )
          }
        </section>
      )}
    </Wrapper>
  );
};

export default FragranceTypeProductsPage;
