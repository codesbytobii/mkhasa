"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { SectionHeader } from "./ui/SectionHeader";
import { Product } from "./ProductCard";
import { ListGrid } from "./ui/ListGrid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import NoResult from "./NoResult";
import { Button } from "./button";
import Link from "next/link";
import { useLoaderData } from "@/legacy/router-shim";
import { toFragrancePath } from "../utils/paths";

const NicheFragrancesProducts = () => {
  const loaderData = useLoaderData();
  const [fragranceTypes, setFragranceTypes] = useState(
    () => loaderData?.nicheFragranceTypes || []
  );
  const [selectedfragranceTypes, setSelectedfragranceTypes] = useState("");
  const [fragraceProducts, setFragranceProducts] = useState(
    () => loaderData?.nicheProducts || []
  );

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  });

  const fetchFragrances = async () => {
    try {
      const response = await api.get("/all/fragrance");
      const data = response?.data;
      setFragranceTypes(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectFragranceType = (text) => {
    setSelectedfragranceTypes(text);
  };

  const fetchFragranceProducts = async () => {
    try {
      const response = await api.get(
        `/product/fragrance/${selectedfragranceTypes || "arabian"}`
      );
      const data = response?.data;
      setFragranceProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (loaderData?.nicheProducts?.length && !selectedfragranceTypes) return;
    if (fragranceTypes?.length) {
      fetchFragranceProducts();
    }
  }, [fragranceTypes, selectedfragranceTypes, loaderData]);

  useEffect(() => {
    if (loaderData?.nicheFragranceTypes?.length) return;
    fetchFragrances();
  }, [loaderData]);


  return (
    <section className="py-8">
      <section className="flex justify-between items-center">
        <SectionHeader header={selectedfragranceTypes || "Arabian"} />
        <Select onValueChange={handleSelectFragranceType}>
          <SelectTrigger className="w-fit capitalize">
            <SelectValue placeholder="Select fragrance type" />
          </SelectTrigger>
          <SelectContent>
            {fragranceTypes?.map((item, index) => (
              <SelectItem
                value={item.type}
                key={item._id}
                className="capitalize"
              >
                {item.type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>
      {fragraceProducts?.length === 0 ? (
        <NoResult />
      ) : (
        <ListGrid>
          {fragraceProducts?.slice(0, 4).map(({ product, name, category, price, discountedPrice, mainImage, _id, available }, index) => (
            <li key={_id || index} className="min-w-[11rem] md:min-w-[13rem]">
              <Product
                name={name}
                product={product}
                category={category}
                originalPrice={price}
                discountedPrice={discountedPrice}
                image={mainImage}
                id={_id}
                available={available}
              />
            </li>
          )
          )}
        </ListGrid>
      )}

      <Link href={toFragrancePath(selectedfragranceTypes || fragranceTypes[0]?.type)} className="flex bg-transparent text-black px-8 py-2 rounded-full hover:bg-black hover:text-white max-w-[300px] mt-4 mx-auto text-center justify-center transition-all border border-black">See More</Link>

    </section>
  );
};

export default NicheFragrancesProducts;
