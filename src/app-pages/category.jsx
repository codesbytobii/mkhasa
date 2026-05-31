"use client";

import { useParams } from "next/navigation";
import { Wrapper } from "../components/ui/Wrapper";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Fragment, useState, useEffect } from "react";
import { useInfiniteProducts } from "../hooks/query/useProducts";
import { Product } from "../components/ProductCard";
import { Icon } from "@iconify/react";
import { Sort } from "../components/Sort";
import { useSearchParams } from "next/navigation";
import { Recommended } from "../components/Recommended";
import { TopSelling } from "../components/TopSelling";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

export const Component = ({ initialCategoryName = "", initialCategoryData = null }) => {
  const params = useParams();
  const categoryParam = initialCategoryName || params?.category;
  const [category, setCategory] = useState(categoryParam);
  const [categoryData, setCategoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(!initialCategoryData);
  const searchParams = useSearchParams();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!categoryParam) throw new Error("Invalid category");

  const sortBy = searchParams.get("sort") || "";
  const filterBy = searchParams.get("filter") || "";

  // Fetch category details when URL changes
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      setIsLoading(true);
      try {
        // You might need to adjust this endpoint based on your API
        const response = await axios(`${baseUrl}/product/category/${categoryParam}`);
        setCategoryData(response.data);
        setCategory(categoryParam);
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryParam !== category) {
      fetchCategoryDetails();
    } else if (initialCategoryData) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [categoryParam, category, baseUrl, initialCategoryData]);

  const url = filterBy
    ? `product/category/${categoryParam}/appeal/${filterBy}?`
    : sortBy
      ? `product/category/${sortBy}/${categoryParam}?`
      : `product/category/${categoryParam}?`;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteProducts(url, "category", categoryParam, {
    sortBy,
    filterBy,
    __initialData: !sortBy && !filterBy ? initialCategoryData : null,
  });

  const onClick = (term) => {
    if (typeof term !== "string") return;
    if (!term) {
      return setSearchParams({});
    }
    if (term.startsWith("sort")) {
      searchParams.has("filter") && searchParams.delete("filter");
      setSearchParams({ ...searchParams, sort: term.split("-")[1] });
    }
    if (term.startsWith("filter")) {
      searchParams.has("sort") && searchParams.delete("sort");
      setSearchParams({ ...searchParams, filter: term.split("-")[1] });
    }
  };

  // Access total count from the first page data
  const totalProducts = data?.pages?.[0]?.totalProducts || 0;

  if (isLoading && !data) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <section>
        <Wrapper className="py-6">
          <div className="text-sm text-gray-600">
            {totalProducts} <strong>results </strong> for {categoryParam}
          </div>
          <div className="flex items-center justify-between py-4">
            <SectionHeader header={categoryParam} className="text-nowrap" />
            <Sort onClick={onClick} sort={sortBy} />
          </div>
          {status === "pending" ? (
            "Loading..."
          ) : status === "error" ? (
            `An error has occurred`
          ) : (
            <>
              <ul className="grid justify-center grid-flow-row grid-cols-2 gap-1 pt-8 auto-rows-fr sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {data.pages.map((group, i) => (
                  <Fragment key={i}>
                    {group.products?.map((product) => {
                      return (
                        <li key={product._id}>
                          <Product
                            product={product.name}
                            name={product.name}
                            category={product.category}
                            originalPrice={product.price}
                            discountedPrice={product?.discountedPrice}
                            image={product.mainImage}
                            id={product._id}
                            available={product.available}
                          />
                        </li>
                      );
                    })}
                  </Fragment>
                ))}
              </ul>
              <div className="pt-6">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                  className={`${!hasNextPage ? "hidden" : ""
                    } text-white bg-app-red py-2 px-6 hover:bg-app-red/70 disabled:bg-app-black/50`}
                >
                  {isFetchingNextPage
                    ? "Loading more..."
                    : "Load More Products"}
                </button>
              </div>
              <div className="flex justify-center">
                {isFetching && !isFetchingNextPage ? (
                  <Icon
                    icon="svg-spinners:3-dots-bounce"
                    className="text-4xl"
                  />
                ) : null}
              </div>
            </>
          )}

          <TopSelling />
          <Recommended />
        </Wrapper>
      </section>
    </>
  );
};
