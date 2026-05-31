"use client";




import { useEffect, useState, useRef } from "react";
import { SectionHeader } from "./ui/SectionHeader";
import { Product } from "./ProductCard";
import axios from "../utils/axios";
import useLongPress from "../hooks/utils/useLongPress";
import { Icon } from "@iconify/react";
import { cn } from "../utils/cn.js";
import { useLoaderData } from "@/legacy/router-shim";

export const NewDeals = ({ horizontalOnSmallScreens = true }) => {
  const loaderData = useLoaderData();
  const [recommend, setRecommended] = useState(() => loaderData?.newArrivals || []);
  const [err, setErr] = useState(null);
  const ref = useRef();

  const { getHandlers, setElement } = useLongPress(ref.current);

  useEffect(() => {
    setElement(ref.current);
  }, [setElement]);

  async function getRecommended() {
    try {
      const response = await axios.get("/deal/product"); // Ensure this URL is correct
      // console.log("Fetched data:", response?.data); // Debugging: Log the fetched data

      setRecommended(() =>
        response?.data.map(({ product }) => {
          return {
            id: product?._id || 0,
            name: product.name,
            category: product.category,
            price: product.price,
            image:
              product.mainImage || product.firstImage || product.secondImage,
          };
        })
      );
    } catch (error) {
      setErr(error?.message ?? "Error fetching data");
    }
  }

  useEffect(() => {
    if (loaderData?.newArrivals?.length) return;
    getRecommended();
  }, [loaderData]);



  if (recommend.length === 0) {
    return null;
  }


  return (
    <section className="py-8   ">
      <div className="flex items-center justify-between">
        <SectionHeader header="Deals" />
        <div className="hidden gap-4">
          <button
            {...getHandlers("backward")}
            className="h-10 w-10 bg-white rounded-full grid place-items-center hover:scale-105"
          >
            <Icon icon="fa6-solid:angle-left" style={{ fontSize: 28 }} />
          </button>
          <button
            {...getHandlers("forward")}
            className="h-10 w-10 bg-white rounded-full grid place-items-center hover:scale-105"
          >
            <Icon icon="fa6-solid:angle-left" hFlip style={{ fontSize: 28 }} />
          </button>
        </div>
      </div>

      {err ? (
        <p>{err}</p>
      ) : (
        <ul
          className="pt-8 w-full gap-4 flex sm:flex-nowrap overflow-x-auto transition-transform duration-700 ease-in-out"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          ref={ref}
        >
          {recommend.map(({ product, category, price, image, id, available, name }, index) => (
            <li
              key={index}
              className={cn(
                "min-w-[11rem] md:w-[13rem]",
                horizontalOnSmallScreens && index === 0 ? " md:ml-0" : ""
              )}
            >
              <Product
                product={product}
                category={category}
                originalPrice={price}
                image={image}
                id={id}
                available={available}
                name={name}
                className="h-full flex flex-col justify-between"
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
