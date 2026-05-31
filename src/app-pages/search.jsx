"use client";


import { Wrapper } from "../components/ui/Wrapper";
import { Navigation } from "../components/ui/Navigation";
import { SectionHeader } from "../components/ui/SectionHeader";
import { useInfiniteProducts } from "../hooks/query/useProducts";
import { Product } from "../components/ProductCard";
import { Sort } from "../components/Sort";
import { useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Fragment, useEffect, useRef } from "react";
import { Recommended } from "../components/Recommended";
import { BestSellers } from "../components/BestSellers";
import { TopSelling } from "../components/TopSelling";

export const Component = () => {
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sort") || "";
  const search = searchParams.get("s") || "";
  const sectionRef = useRef(null);
  const markerRef = useRef(null);
  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null, // Use the viewport as the root
      rootMargin: "0px", // No margin around the root
      threshold: 1.0, // Fully visible element
    });

    if (markerRef.current) {
      observer.observe(markerRef.current);
    }

    return () => {
      if (markerRef.current) {
        observer.unobserve(markerRef.current);
      }
    };
  }, []);

  if (!search) throw new Error("Invalid search");
  // const sortBy = searchParams.get("sort") || "";
  const filterBy = searchParams.get("filter") || "";

  const url = `search?name=${search}&sort=${sortBy}`


  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    refetch,

  } = useInfiniteProducts(`search?name=${search}&sortBy=${sortBy}`, "search", {
    search,
    sortBy,
  });


  const onClick = (term) => {
    if (typeof term !== "string") return;
    if (!term) {
      searchParams.delete("sort");
      setSearchParams(searchParams);
    } else {
      setSearchParams({
        ...Object.fromEntries([...searchParams]),
        sort: term.split("-")[1],
      });
    }
  };

  // useEffect(() => {
  //   refetch();
  // }, [search, sortBy, refetch]);

  const isEmpty = data?.pages?.[0]?.products?.length === 0;
  const totalProducts = data?.pages?.[0]?.totalProducts || 0;

  return (
    <>
      
      <section>
        {/* <div className="relative">
          <div className="absolute right-0 left-0 top-0 bottom-0 bg-[#3333]" />
          <div className="absolute left-0 w-full top-1/3">
            <Wrapper>
              <Navigation
                location={[
                  { description: "Home", href: "/", title: "Go to Home Page" },
                  {
                    description: "Search",
                    to: `${location.pathname}${location.search}`,
                  },
                ]}
                className="text-xl py-4"
                iconClassName="text-2xl"
                currentLocationClassName="text-white"
              /> 
              <h2 className="text-xl font-     tracking-tighter text-white md:tracking-normal">
                Search Results for "{search}"
              </h2>
            </Wrapper>
          </div>
          <img
            // src={banner}
            alt=""
            className="object-cover object-center w-full min-h-48 max-h-60"
          />
        </div> */}
        <Wrapper className="py-6">
          <div className="text-sm text-gray-600">
            {totalProducts} <strong>results </strong> for {search}
          </div>
          <div className="flex items-center justify-between py-4">
            <SectionHeader header="Search" />
            <Sort onClick={onClick} sort={sortBy} />
          </div>
          {status === "loading" ? (
            "Loading..."
          ) : status === "error" ? (
            `An error has occurred: ${error.message}`
          ) : (
            <>
              {isEmpty ? (
                <div className="text-center">
                  <div className="flex flex-col text-center justify-center items-center gap-3 md:flex-row md:text-left">
                    <Icon icon="material-symbols:error-outline" style={{ fontSize: 72, color: "#F24E1E" }} />
                    <div className="flex flex-col justify-center items-center md:justify-start md:items-start">
                      <h2 className="text-xl font-semibold">NOTHING MATCHES YOUR SEARCH</h2>
                      <p className="text-gray-400">No results could be found for "{search}"</p>
                    </div>
                  </div>

                  {/* Add your recommendations and categories here */}
                </div>
              ) : (
                <>
                  <ul
                    className="grid justify-center grid-flow-row grid-cols-2 gap-4
                   pt-8 auto-rows-fr sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                    ref={sectionRef}
                  >
                    {data?.pages?.map((group, i) => (
                      <Fragment key={i}>
                        {group.products?.map((product) => (
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
                        ))}
                      </Fragment>
                    ))}
                  </ul>
                  <div ref={markerRef} style={{ height: "1px", background: "transparent" }} />
                  <div className="mt-3">
                    {hasNextPage && (
                      <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className={`hidden ${!hasNextPage ? "hidden" : ""
                          } text-white bg-app-red py-2 px-6 hover:bg-app-red/70 disabled:bg-app-black/50`}
                      >
                        {isFetchingNextPage ? "Loading more..." : "Load More"}
                      </button>
                    )}
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
            </>
          )}
          <TopSelling />
          <Recommended />
        </Wrapper>
      </section>
    </>
  );
};
