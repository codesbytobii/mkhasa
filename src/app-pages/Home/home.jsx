"use client";

import React from "react";
import { Wrapper } from "../../components/ui/Wrapper";
import { SwiperElem } from "../../components/Swiper";
import { LatestProducts } from "../../components/LatestProducts";
import { NewDeals } from "../../components/NewDeals";
import { BestSellers } from "../../components/BestSellers";
import { FeaturedProducts } from "../../components/FeaturedProducts";
import BrandsSlider, { MobileBrandSlider } from "./components/BrandsSlider";
import NicheFragrancesProducts from "../../components/NicheFragrancesProducts";
import BodySlider from "./components/BoddySlider";

export const Component = () => {
  return (
    <main className="bg-white">
      <Wrapper>
        <h1 className="text-center">Buy Original Perfumes in Nigeria at Affordable Prices</h1>
        <div className="flex flex-col gap-8 py-2 ">
          <SwiperElem />
        </div>
        <BrandsSlider />
        <MobileBrandSlider />
        <NicheFragrancesProducts />
      </Wrapper>
      <BodySlider />
      <Wrapper>
        <LatestProducts />
        <FeaturedProducts />
        <BestSellers />
        <NewDeals />
        {/* <Sales /> */}
        {/* <NewArrivals /> */}
        {/* <TopCategories /> */}
        {/* <div className="pt-6"><Features /></div> */}
      </Wrapper>
    </main>
  );
};
