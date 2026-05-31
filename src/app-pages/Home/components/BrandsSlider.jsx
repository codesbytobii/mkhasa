"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { useQuery } from "@tanstack/react-query";
import { Carousel, CarouselContent, CarouselItem } from "../../../components/ui/carousel";
import Link from "next/link";
import { toBrandPath } from "../../../utils/paths";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/all/brands`);
      if (!res.ok) throw new Error("Failed to fetch brands");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    select: (data) => (Array.isArray(data) ? data.filter((b) => b?.name) : []),
  });
}

const BrandSlider = () => {
  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const { data: brands = [] } = useBrands();

  return (
    <section className="mt-4 flex">
      <section className="w-[350px] bg-gray-100 space-y-2 min-h-full p-4 hidden md:flex flex-col justify-end">
        <h2 className="text-4xl font-medium text-[#161616]">Discover</h2>
        <p className="text-sm">The Best in Brands, All in One Place.</p>
        <Link className="bg-black text-white block py-2 px-4 rounded hover:bg-gray-900 transition-all" href="/brands">
          See More
        </Link>
      </section>
      <Carousel plugins={[plugin.current]} className="w-full border items-center hidden md:flex"
        onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
        <CarouselContent className="h-full">
          {brands.map((brand, index) => (
            <CarouselItem key={index} className="border items-center flex justify-center basis-1/3 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
              <Link href={toBrandPath(brand.name)} className="m-auto items-center flex justify-center">
                <img src={brand.image} alt={`${brand.name} brand image`} className="w-[90%] m-auto" />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default BrandSlider;

export const MobileBrandSlider = () => {
  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const { data: brands = [] } = useBrands();

  return (
    <section className="md:hidden space-y-4 mt-8">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Shop By Brands</h3>
        <Link className="underline" href="/brands">See more</Link>
      </div>
      <Carousel plugins={[plugin.current]} className="w-full border flex items-center"
        onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
        <CarouselContent>
          {brands.map((brand, index) => (
            <CarouselItem key={index} className="flex border items-center basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
              <Link href={toBrandPath(brand.name)} className="m-auto items-center flex justify-center">
                <img src={brand.image} alt={`${brand.name} brand image`} className="w-[60px]" />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};
