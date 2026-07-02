"use client";



import { SectionHeader } from "./ui/SectionHeader";
import { Product } from "./ProductCard";
import { useLoaderData } from "@/legacy/router-shim";
import useLongPress from "../hooks/utils/useLongPress";
import { Icon } from "@iconify/react";
import { useRef, useEffect } from "react";

export const BestSellers = ({ horizontalOnSmallScreens = true }) => {
  //const { bestsellers } = useLoaderData();
  const { bestsellers = [] } = useLoaderData() || {};
  const ref = useRef();

  const { getHandlers, setElement } = useLongPress(ref.current);

  useEffect(() => {
    setElement(ref.current);
  }, [setElement]);





  return (
    <section className="py-8">
      <div className="flex items-center justify-between">
        <SectionHeader header="Best Sellers" />
        <div className="hidden gap-4">
          <button
            {...getHandlers("backward")}
            className="h-10 w-10 bg-white rounded-full grid place-items-center hover:scale-105"
          // onClick={() => scrollByAmount(-300)}
          >
            <Icon icon="fa6-solid:angle-left" style={{ fontSize: 28 }} />
          </button>
          <button
            {...getHandlers("forward")}
            className="h-10 w-10 bg-white rounded-full grid place-items-center hover:scale-105"
          // onClick={() => scrollByAmount(300)}
          >
            <Icon icon="fa6-solid:angle-left" hFlip style={{ fontSize: 28 }} />
          </button>
        </div>
      </div>
      <ul
        className="pt-8 w-full gap-4 flex sm:flex-nowrap overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        ref={ref}
      >
        {bestsellers.map(
          (
            { product, category, originalPrice, discountedPrice, image, id, available },
            index
          ) => (
            <li key={index} className="min-w-[11rem] md:min-w-[13rem]">
              <Product
                available={available}
                product={product}
                name={product}
                category={category}
                originalPrice={originalPrice}
                discountedPrice={discountedPrice}
                image={image}
                id={id}
              />
            </li>
          )
        )}
      </ul>
    </section>
  );
};


