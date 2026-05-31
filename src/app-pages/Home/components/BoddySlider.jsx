"use client";

import Link from "next/link";
import BodySlides from "../../../../data/body_slides.json";
import MobileBodySlides from "../../../../data/mobile_body_slide.json";
import { Carousel, CarouselContent, CarouselItem } from "../../../components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const BodySlider = () => (
  <>
    <div className="hidden md:block"><DesktopBodySlider /></div>
    <div className="md:hidden"><MobileBodySlider /></div>
  </>
);

const DesktopBodySlider = () => (
  <Carousel plugins={[Autoplay({ delay: 5000 })]}>
    <CarouselContent className="gap-x-2">
      {BodySlides?.map((slide, index) => (
        <CarouselItem key={index} className="max-w-[90vw] min-h-[60vh] w-full relative">
          <Link href={slide.link || "/"} className="block w-full h-full">
            <img src={slide.image} alt="Product promotion" className="h-full w-full object-cover absolute inset-0" />
          </Link>
        </CarouselItem>
      ))}
    </CarouselContent>
  </Carousel>
);

const MobileBodySlider = () => (
  <Carousel plugins={[Autoplay({ delay: 5000 })]}>
    <CarouselContent className="gap-x-2">
      {MobileBodySlides?.map((slide, index) => (
        <CarouselItem key={index} className="max-w-[90vw] min-h-[273px] flex-col w-full relative">
          <img src={slide.image} alt="Product promotion" className="max-h-[200px] sm:max-h-[400px] w-full object-cover" />
          <Link href={slide.link || "/"} className="block max-w-[250px] text-center mx-auto mt-2 hover:bg-gray-800 transition-all bg-[#0FA958] text-white text-sm lg:text-xl py-2 lg:py-3 w-full font-semibold rounded-full">
            Buy Now
          </Link>
        </CarouselItem>
      ))}
    </CarouselContent>
  </Carousel>
);

export default BodySlider;
