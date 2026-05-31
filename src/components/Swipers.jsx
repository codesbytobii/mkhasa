"use client";

// import { Icon } from "@iconify/react";
// import { useEffect, useRef } from "react";
// import { register } from "swiper/element/bundle";

// export const SwiperElem = () => {
//   const ref = useRef();

//   useEffect(() => {
//     register();
//     const swiperEl = ref.current;
//     const swiperParams = {
//       loop: true,
//       speed: 200,
//       navigation: {
//         nextEl: ".swiper-button-next",
//         prevEl: ".swiper-button-prev",
//       },
//       pagination: {
//         el: ".swiper-pagination",
//         type: "custom",
//         renderCustom: function (swiper, current, total) {
//           const arr = [];
//           for (let i = 0; i < total; i++) {
//             arr.push(i + 1);
//           }
//           const elem = arr.map((val) => {
//             return `<li style="background-color:white;height:${
//               val == current ? "14px" : "8px"
//             };width:64px;border-radius:20px"/>`;
//           });
//           return elem.join("");
//         },
//       },
//     };
//     Object.assign(swiperEl, swiperParams);
//     swiperEl.initialize();
//   }, []);

//   return (
//     <div className="relative w-full md:w-[calc(100%-292px)]">
//       <swiper-container
//         ref={ref}
//         slides-per-view="1"
//         navigation="true"
//         init="false"
//         a11y-prev-slide-message="Previous slide"
//         a11y-next-slide-message="Next slide"
//         autoplay="true"
//         autoplay-delay="5000"
//       >
//         <swiper-slide
//           style={{
//             borderRadius: 24,
//             overflow: "hidden",
//           }}
//         >
          
//         </swiper-slide>
//              </swiper-container>

//       <button className="swiper-button-prev flex absolute bg-[#3333] w-12 h-12 z-50 left-8 top-1/2 items-center justify-center rounded-full">
//         <Icon
//           icon="fa6-solid:angle-right"
//           style={{ fontSize: 10 }}
//           color="white"
//           hFlip="true"
//         />
//       </button>
//       <button className="swiper-button-next flex absolute bg-[#3333] w-12 h-12 z-50 right-8 top-1/2 items-center justify-center rounded-full">
//         <Icon
//           icon="fa6-solid:angle-right"
//           style={{ fontSize: 10 }}
//           color="green"
//         />
//       </button>
//       <ul className="absolute z-10 flex items-center gap-2 swiper-pagination bottom-4 left-4 md:bottom-8"></ul>
//     </div>
//   );
// };

// import { Icon } from "@iconify/react";
// import { useEffect, useRef } from "react";
// import { register } from "swiper/element/bundle";

// export const SwiperElem = () => {
//   const ref = useRef();

//   useEffect(() => {
//     register();
//     const swiperEl = ref.current;
//     const swiperParams = {
//       loop: true,
//       speed: 200,
//       navigation: {
//         nextEl: ".swiper-button-next",
//         prevEl: ".swiper-button-prev",
//       },
//       pagination: {
//         el: ".swiper-pagination",
//         type: "custom",
//         renderCustom: function (swiper, current, total) {
//           const arr = [];
//           for (let i = 0; i < total; i++) {
//             arr.push(i + 1);
//           }
//           const elem = arr.map((val) => {
//             return `<li style="background-color:white;height:${
//               val == current ? "14px" : "8px"
//             };width:64px;border-radius:20px;margin:0 2px"/>`;
//           });
//           return elem.join("");
//         },
//       },
//     };
//     Object.assign(swiperEl, swiperParams);
//     swiperEl.initialize();
//   }, []);

//   return (
//     <div className="relative w-full md:w-[calc(100%-292px)] overflow-hidden">
//       <swiper-container
//         ref={ref}
//         slides-per-view="1"
//         navigation="true"
//         init="false"
//         a11y-prev-slide-message="Previous slide"
//         a11y-next-slide-message="Next slide"
//         autoplay="true"
//         autoplay-delay="5000"
//         style={{ borderRadius: "24px" }}
//       >
//         <swiper-slide
//           style={{
//             borderRadius: 24,
//             overflow: "hidden",
//           }}
//         >
//         </swiper-slide>
//       </swiper-container>

//       <button className="swiper-button-prev flex absolute bg-[#3333] w-12 h-12 z-50 left-8 top-1/2 transform -translate-y-1/2 items-center justify-center rounded-full">
//         <Icon
//           icon="fa6-solid:angle-right"
//           style={{ fontSize: 10 }}
//           color="white"
//           hFlip="true"
//         />
//       </button>
//       <button className="swiper-button-next flex absolute bg-[#3333] w-12 h-12 z-50 right-8 top-1/2 transform -translate-y-1/2 items-center justify-center rounded-full">
//         <Icon
//           icon="fa6-solid:angle-right"
//           style={{ fontSize: 10 }}
//           color="green"
//         />
//       </button>
//       <ul className="absolute w-10 z-10 flex items-center gap-2 swiper-pagination bottom-4 left-1/2 transform -translate-x-1/2 md:bottom-8"></ul>
//     </div>
//   );
// };

import { Icon } from "@iconify/react";
import { useEffect, useRef } from "react";
import { register } from "swiper/element/bundle";

export const SwiperElem = () => {
  const ref = useRef();

  useEffect(() => {
    register();
    const swiperEl = ref.current;
    const swiperParams = {
      loop: true,
      speed: 200,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        type: "custom",
        renderCustom: function (swiper, current, total) {
          const arr = [];
          for (let i = 0; i < total; i++) {
            arr.push(i + 1);
          }
          const elem = arr.map((val) => {
            return `<li className="pagination-bullet ${
              val == current ? "active-bullet" : ""
            }"></li>`;
          });
          return elem.join("");
        },
      },
    };
    Object.assign(swiperEl, swiperParams);
    swiperEl.initialize();
  }, []);

  return (
    <>
      <style>
        {`
          .pagination-bullet {
            background-color: green;
            height: 8px;
            width: 22px;
            border-radius: 20px;
            margin: 0 1px;
          }

          .pagination-bullet.active-bullet {
            height: 14px;
          }

          @media (min-width: 768px) {
            .pagination-bullet {
              height: 8px;
              width: 64px;
              margin: 0 2px;
            }

            .pagination-bullet.active-bullet {
              height: 14px;
            }
          }
        `}
      </style>
      <div className="relative w-full md:w-[calc(100%-292px)] overflow-hidden">
        <swiper-container
          ref={ref}
          slides-per-view="1"
          navigation="true"
          init="false"
          a11y-prev-slide-message="Previous slide"
          a11y-next-slide-message="Next slide"
          autoplay="true"
          autoplay-delay="4000"
          style={{ borderRadius: "16px" }}
        >
          <swiper-slide
            style={{
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
          </swiper-slide>
        </swiper-container>

        <button className="swiper-button-prev flex absolute bg-[#3333] w-8 h-8 md:w-12 md:h-12 z-50 left-4 md:left-8 top-1/2 transform -translate-y-1/2 items-center justify-center rounded-full">
          <Icon
            icon="fa6-solid:angle-right"
            className="text-xs md:text-sm"
            color="white"
            hFlip="true"
          />
        </button>
        <button className="swiper-button-next flex absolute bg-[#3333] w-8 h-8 md:w-12 md:h-12 z-50 right-4 md:right-8 top-1/2 transform -translate-y-1/2 items-center justify-center rounded-full">
          <Icon
            icon="fa6-solid:angle-right"
            className="text-xs md:text-sm"
            color="green"
          />
        </button>
        <ul className="absolute z-10 flex items-center gap-1 md:gap-2 swiper-pagination bottom-2 left-1/2 transform -translate-x-1/2 md:bottom-8"></ul>
      </div>
    </>
  );
};

/* Add the following CSS to your styles */

