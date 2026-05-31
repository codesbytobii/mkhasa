"use client";

// import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import heroimg from "../assets/images/_Downloader1.png";
import elipses from "../assets/images/Ellipse 28.png";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import "../../src/index.css";

// import required modules
import { Parallax, Pagination, Navigation } from "swiper/modules";
const CarouselSlider = () => {
  return (
    <>
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        speed={600}
        parallax={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Parallax, Pagination, Navigation]}
        className="mySwiper"
      >
        <div slot="container-start" className="parallax-bg bg-[#A40001]"></div>
        <SwiperSlide>
          <div className="w-full h-[500px] bg-[#A40001] relative">
            <div className="title w-full  bg-[#A40001]">
              <div className="flex flex-col gap-4">
                <h1 className="text-[#fff]"></h1>
              </div>
              <img alt="Alipses product image" src={elipses} className="absolute top-0 right-0 z-[1]" />
              <img alt="Alipses product image" src={heroimg} className="absolute bottom-0 right-0 z-[2]" />
            </div>
            {/* <div className="subtitle" data-swiper-parallax="-200">
              Subtitle
            </div> */}
            <div className="text" data-swiper-parallax="-100"></div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="title" data-swiper-parallax="-300"></div>
          <div className="subtitle" data-swiper-parallax="-200">
            Subtitle
          </div>
          <div className="text" data-swiper-parallax="-100"></div>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default CarouselSlider;
