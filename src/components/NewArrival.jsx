"use client";

import { useEffect, useRef } from "react";
import { register } from "swiper/element/bundle";
import { Icon } from "@iconify/react";
import Link from "next/link";

// Import your category images here
import airFreshenerImage from "../assets/images/topCategories/airfreshner.webp";
import bodySprayImage from "../assets/images/topCategories/bodyspray2.webp";
import rollOnImage from "../assets/images/topCategories/rollon.webp";
import diffusersImage from "../assets/images/topCategories/diffusers.webp";

const categories = [
    { name: "Air Freshener", image: airFreshenerImage, link: "/categories/Air%20Freshener" },
    { name: "Body Spray", image: bodySprayImage, link: "/categories/body-spray" },
    { name: "Deodorant", image: rollOnImage, link: "/categories/Deodorant" },
    { name: "Diffusers", image: diffusersImage, link: "/categories/diffusers" },
];

const NewArrival = () => {
    const swiperRef = useRef(null);

    useEffect(() => {
        register();
        const swiperEl = swiperRef.current;
        const swiperParams = {
            loop: true,
            speed: 500,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            pagination: {
                el: ".swiper-pagination",
                type: "custom",
                renderCustom: function (swiper, current, total) {
                    return Array(total)
                        .fill()
                        .map((_, i) => `
              <li style="
                background-color: white;
                height: ${i + 1 === current ? "10px" : "6px"};
                width: ${i + 1 === current ? "10px" : "6px"};
                border-radius: 50%;
                margin: 0 2px;
              "></li>
            `)
                        .join("");
                },
            },
        };
        Object.assign(swiperEl, swiperParams);
        swiperEl.initialize();
    }, []);

    return (
        <div className="relative w-full md:w-[calc(100%)]">
            <swiper-container
                ref={swiperRef}
                slides-per-view="1"
                navigation="true"
                init="false"
                a11y-prev-slide-message="Previous slide"
                a11y-next-slide-message="Next slide"
                autoplay="true"
                autoplay-delay="4000"
            >
                {categories.map((category, index) => (
                    <swiper-slide key={index} style={{ borderRadius: 24, overflow: "hidden" }}>
                        <Link href={category.link} style={{ display: "contents" }}>
                            <div className="min-h-[250px] h-[40vw] md:h-[579px] relative">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="block cursor-pointer object-cover bg-no-repeat absolute inset-0 w-full h-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                                    <h2 className="text-white text-base md:text-4xl font-bold">{category.name}</h2>
                                </div>
                            </div>
                        </Link>
                    </swiper-slide>
                ))}
            </swiper-container>

            <button className="swiper-button-prev flex absolute bg-[#3333] w-12 h-12 z-10 left-3 top-[40%] md:top-[46%] items-center justify-center rounded-full">
                <Icon
                    icon="fa6-solid:angle-right"
                    style={{ fontSize: 36 }}
                    color="white"
                    hFlip={true}
                />
            </button>
            <button className="swiper-button-next flex absolute bg-[#3333] w-12 h-12 z-10 right-3 top-[40%] md:top-[46%] items-center justify-center rounded-full">
                <Icon
                    icon="fa6-solid:angle-right"
                    style={{ fontSize: 36 }}
                    color="white"
                />
            </button>
            <ul className="absolute z-10 w-full flex items-center justify-center gap-2 swiper-pagination bottom-4 left-0 md:bottom-8">
            </ul>
        </div>
    );
};

export default NewArrival;
