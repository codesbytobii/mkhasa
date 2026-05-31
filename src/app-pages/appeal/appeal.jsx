"use client";

import { Product } from "../../components/ProductCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Wrapper } from "../../components/ui/Wrapper";
import useAppeal from "./hooks/useAppeal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ListGrid } from "../../components/ui/ListGrid";

const AppealProducts = ({ initialAppealName = "", initialAppealData = null }) => {
  const {
    displayedProducts,
    appealName,
    sorts,
    fetchingAppeal,
    appealProducts,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    handleNextPage,
    handlePrevPage,
    handleSort,
  } = useAppeal({
    initialData: initialAppealData,
    initialAppealName,
  });

  return (
    <>
      <Wrapper>
        <section className="mb-8 flex-wrap flex gap-4 justify-between items-center">
          <span>
            {(appealProducts?.totalProducts || initialAppealData?.totalProducts || 0)}{" "}
            <span className="font-bold">Results</span> for {appealName}
          </span>
          <select
            onChange={(e) => {
              handleSort(e.target.value);
            }}
            className="flex items-center justify-between w-[200px] border px-4 py-2 rounded-md shadow-sm focus:outline-none"
          >
            {sorts.map((catogery, index) => (
              <option
                key={index}
                value={catogery.part}
                className="border-none p-2"
              >
                {catogery.name}
              </option>
            ))}
          </select>
        </section>
        {fetchingAppeal ? (
          <LoadingSpinner />
        ) : (
          <ListGrid>
            {displayedProducts?.map(
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
                <li key={index} className="min-w-[11rem] md:min-w-[13rem]">
                  <Product
                    name={name}
                    product={product}
                    category={category}
                    originalPrice={price}
                    discountedPrice={discountedPrice}
                    image={mainImage}
                    available={available}
                    id={_id}
                  />
                </li>
              )
            )}
          </ListGrid>
        )}

        <section className="flex gap-4 justify-between mb-4 items-center max-w-[400px] mx-auto ">
          <button
            onClick={handlePrevPage}
            disabled={!hasPreviousPage}
            className={`bg-black text-sm py-1 px-4 disabled:bg-[#999] text-white transition-all hover:bg-[#444] ${hasPreviousPage ? "cursor-pointer" : "cursor-not-allowed"
              } flex items-center justify-center `}
          >
            <ChevronLeft className="size-4" />
            <span>Prev</span>
          </button>
          <span>
            {currentPage} of {totalPages}
          </span>
          <button
            disabled={!hasNextPage}
            onClick={handleNextPage}
            className={`bg-black text-sm py-1 px-4 disabled:bg-[#999] text-white transition-all hover:bg-[#444] ${hasNextPage ? "cursor-pointer" : "cursor-not-allowed"
              } flex items-center justify-center `}
          >
            <span>Next</span>
            <ChevronRight className="size-4" />
          </button>
        </section>
      </Wrapper>
    </>
  );
};

export default AppealProducts;
