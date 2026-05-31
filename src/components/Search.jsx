"use client";

import { CategoryPanel } from "./CategoryPanel";
import handair from "../assets/images/handairfresener.png";
// import { DefaultSlider } from "./DefaultSlider";
import productImg1 from "../assets/images/product image(1).svg";
import productImg2 from "../assets/images/product image(2).svg";
import productImg3 from "../assets/images/product image(3).svg";
import productImg4 from "../assets/images/product image(4).svg";
import { Product } from "./ProductCard";
import { useState } from "react";
export const Component = () => {
  // const [searchquery, setSearchQuery] = useState("");
  // const [filteredProducts, setFilteredProducts] = useState([]);
  // const handleSearch = (e) => {
  //   const query = e.target.value;
  //   setSearchQuery(query);
  //   const filtered = products?.filter((product) =>
  //     product.name.toLowerCase().includes(query.toLowerCase())
  //   );
  //   setFilteredProducts(filtered);
  //   console.log(query);
  // };
  const products = [
    {
      product: "Explore Man hikhfik jkgbkb  kubkj hiokb ",
      category: "Body Spray",
      originalPrice: 2400,
      image: productImg1,
    },
    {
      product: "Drty Man",
      category: "Body Spray",
      originalPrice: 2400,
      discountedPrice: 2100,
      image: productImg2,
    },
    {
      product: "Dynamic",
      category: "Body Spray",
      originalPrice: 2400,
      discountedPrice: 2100,
      image: productImg3,
    },
    {
      product: "Mousuf",
      category: "Roll On",
      originalPrice: 2400,
      image: productImg4,
    },
    {
      product: "Explore Man",
      category: "Body Spray",
      originalPrice: 2400,
      discountedPrice: 2100,
      image: productImg1,
    },
  ];
  return (
    <div className="flex ">
      <div className="flex flex-col px-8">
        <CategoryPanel />
        <div className="bg-#000000">{/* <D className="bg-#000000" /> */}</div>
        <div className="w-full pb-3">
          <img src={handair} className="" alt="Handair image" />
        </div>
        <div></div>
      </div>
      <div>
        <div className="flex justify-between gap-96">
          <div className="">
            <h3>Home `&gt;`? Search</h3>
            <h1>19 Results For Sample Search Query</h1>
          </div>
          <div className="">Sort By</div>
        </div>
        <div className="">
          <ul className="grid justify-center grid-flow-row grid-cols-2 gap-4 pt-8 auto-rows-fr sm:grid-cols-3 md:grid-cols-4">
            {products?.map(
              (
                { product, category, originalPrice, discountedPrice, image, available },
                index
              ) => (
                <li key={index}>
                  <Product
                    product={product}
                    name={product}
                    category={category}
                    originalPrice={originalPrice}
                    discountedPrice={discountedPrice}
                    image={image}
                    available={available}
                  />
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
