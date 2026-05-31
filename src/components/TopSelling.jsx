"use client";

// import { useEffect, useState, useRef } from "react";
// import { SectionHeader } from "./ui/SectionHeader";
// import { Product } from "./ProductCard";
// import axios from "../utils/axios";
// import { ListGrid } from "./ui/ListGrid";
// import useLongPress from "../hooks/utils/useLongPress";
// import { Icon } from "@iconify/react";
// import { cn } from "../utils/cn";

// export const TopSelling = ({ horizontalOnSmallScreens = true }) => {
//   const [recommend, setRecommended] = useState([]);
//   const [err, setErr] = useState(null);
//   const ref = useRef();

//   const { getHandlers, setElement } = useLongPress(ref.current);

//   useEffect(() => {
//     setElement(ref.current);
//   }, [setElement]);

//   async function getRecommended() {
//     try {
//       const response = await axios.get("/bestsellers");  // Ensure this URL is correct
//       // console.log("Fetched data:", response?.data);  // Debugging: Log the fetched data

//       setRecommended(() =>
//         response?.data.map(({ product }) => {
//           return {
//             id: product?._id || 0,
//             product: product.name,
//             category: product.category,
//             price: product.price,
//             image:
//               product.mainImage || product.firstImage || product.secondImage,
//           };
//         })
//       );
//       // console.log("Processed recommended products:", recommend);  // Debugging: Log the processed products
//     } catch (error) {
//       console.error("Error fetching data:", error);  // Debugging: Log the error
//       setErr(error?.message ?? "Error fetching data");
//     }
//   }

//   useEffect(() => {
//     getRecommended();
//   }, []);

//   return (
//     <section className="py-8   ">
//       <div className="flex items-center justify-between">
//         <SectionHeader header="Top Selling Products" />

//         <div className="hidden gap-4">
//           <button
//             {...getHandlers("backward")}
//             className="h-10 w-10 bg-white rounded-full grid place-items-center hover:scale-105"
//           >
//             <Icon icon="fa6-solid:angle-left" style={{ fontSize: 28 }} />
//           </button>
//           <button
//             {...getHandlers("forward")}
//             className="h-10 w-10 bg-white rounded-full grid place-items-center hover:scale-105"
//           >
//             <Icon icon="fa6-solid:angle-left" hFlip style={{ fontSize: 28 }} />
//           </button>
//         </div>
//       </div>

//       {err ? (
//         <p>{err}</p>
//       ) : recommend.length > 0 ? (
//         <ListGrid horizontalOnSmallScreens={horizontalOnSmallScreens}>
//           {recommend.map(({ product, category, price, image, id }, index) => (
//             <li
//               key={index}
//               className={cn(
//                 "min-w-[11rem] ",
//                 horizontalOnSmallScreens && index === 0 ? "ml-96 md:ml-0" : ""
//               )}
//             >
//               <Product
//                 product={product}
// available={product.available}
//                 category={category}
//                 originalPrice={price}
//                 image={image}
//                 id={id}
//                 className="h-full flex flex-col justify-between"
//               />
//             </li>
//           ))}
//         </ListGrid>
//       ) : (
//         <p>Loading data</p>
//       )}
//     </section>
//   );
// };

import { useEffect, useState, useRef } from "react";
import { SectionHeader } from "./ui/SectionHeader";
import { Product } from "./ProductCard";
import axios from "../utils/axios";
import useLongPress from "../hooks/utils/useLongPress";
import { Icon } from "@iconify/react";
// import { cn } from "../utils/cn";

export const TopSelling = ({ horizontalOnSmallScreens = true }) => {
  const [recommend, setRecommended] = useState([]);
  const [err, setErr] = useState(null);
  const ref = useRef();

  const { getHandlers, setElement } = useLongPress(ref.current);

  useEffect(() => {
    setElement(ref.current);
  }, [setElement]);

  async function getRecommended() {
    try {
      const response = await axios.get("/bestsellers");  // Ensure this URL is correct
      setRecommended(() =>
        response?.data.map(({ product }) => {
          return {
            id: product?._id || 0,
            product: product.name,
            category: product.category,
            price: product.price,
            image:
              product.mainImage || product.firstImage || product.secondImage,
          };
        })
      );
    } catch (error) {
      console.error("Error fetching data:", error);  // Debugging: Log the error
      setErr(error?.message ?? "Error fetching data");
    }
  }

  useEffect(() => {
    getRecommended();
  }, []);

  return (
    <section className="py-8   ">
      <div className="flex items-center justify-between">
        <SectionHeader header="Top Selling Products" />
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
      ) : recommend.length > 0 ? (
        <ul
          className="pt-8 w-full gap-4 flex sm:flex-nowrap overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          ref={ref}
        >
          {recommend.map(({ product, category, price, image, id, available }, index) => (
            <li
              key={index}
              className="min-w-[13rem]"
            >
              <Product
                product={product}
                name={product}
                category={category}
                originalPrice={price}
                image={image}
                available={available}
                id={id}
                className="h-full flex flex-col justify-between"
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading data</p>
      )}
    </section>
  );
};
