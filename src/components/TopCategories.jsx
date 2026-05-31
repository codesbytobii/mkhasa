"use client";

import { CategoryCard } from "./CategoryCard";
import perfume from "../assets/images/perfume.webp";
import useLongPress from "../hooks/utils/useLongPress";
import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { SectionHeader } from "./ui/SectionHeader";
import { useCategory } from "../hooks/query/useCategory";

export const TopCategories = () => {
  const { status, categories } = useCategory();

  const ref = useRef();

  const { getHandlers, setElement } = useLongPress(ref.current);

  useEffect(() => {
    setElement(ref.current);
  }, []);

  // const scrollByAmount = (amount) => {
  //   if (ref.current) {
  //     ref.current.scrollBy({
  //       left: amount,
  //       behavior: "smooth",
  //     });
  //   }
  // };

  return (
    <section className="py-8 block mb-40">
      <div className="flex items-center justify-between">
        <SectionHeader header="Value Packs" />

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

      <ul className="pt-8 w-full gap-4 flex sm:flex-nowrap overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        ref={ref}>
        {status === "pending" ? (
          "Loading..."
        ) : status === "error" ? (
          `An error has occurred`
        ) : (
          <>
            {categories.map(({ numberOfProducts, image, name }, index) => (
              <li key={index} className="grow-0 shrink-0">
                <CategoryCard
                  numberOfProducts={numberOfProducts}
                  category={name}
                  image={image}
                />
              </li>
            ))}
          </>
        )}
      </ul>
    </section>
  );
};
