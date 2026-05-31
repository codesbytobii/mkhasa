import React from "react";
import { cn } from "../utils/cn";
import Link from "next/link";
import { toProductPath } from "../utils/paths";

const FBTList = ({ products }) => (
  <>
    {products?.length === 1 && (
      <Link href={toProductPath(products[0]?.name)}
        className="border p-2 rounded-md flex items-center justify-center "
      >
        <img src={products[0]?.mainImage} alt={products[0]?.name + " product image"} />
      </Link>
    )}
    {products?.length === 2 && (
      <section className="grid grid-cols-2 gap-2">
        {products?.map((product) => (
          <Link
            key={product?._id || product?.name}
            href={toProductPath(product?.name)} className="border p-2 rounded-md flex items-center justify-center ">
            <img src={product?.mainImage} alt={products?.name + " product image"} />
          </Link>
        ))}
      </section>
    )}
    {products?.length === 3 && (
      <section className="grid grid-cols-2 gap-2">
        {products?.map((product, index) => (
          <Link
            key={product?._id || `${product?.name}-${index}`}
            href={toProductPath(product?.name)}
            className={cn(
              `p-2 rounded-md flex items-center justify-center  border`,
              index == 0 && "three-fbt"
            )}
          >
            <img src={product?.mainImage} alt={products?.name + " product image"} />
          </Link>
        ))}
      </section>
    )}
    {products?.length === 4 && (
      <section className="grid grid-cols-3 gap-2">
        {products?.map((product, index) => (
          <Link
            key={product?._id || `${product?.name}-${index}`}
            href={toProductPath(product?.name)}
            className={cn(
              `p-2 rounded-md flex items-center justify-center  border`,
              index == 0 && "four-fbt"
            )}
          >
            <img src={product?.mainImage} alt={products?.name + " product image"} className="w-full" />
          </Link>
        ))}
      </section>
    )}
    {products?.length === 5 && (
      <section className="grid grid-cols-3 gap-1">
        {products?.map((product, index) => (
          <Link
            key={product?._id || `${product?.name}-${index}`}
            href={toProductPath(product?.name)}
            className={cn(
              `p-2 rounded-md flex items-center justify-center  border`,
              index == 0 && "five-fbt"
            )}
          >
            <img src={product?.mainImage} alt={products?.name + " product image"} />
          </Link>
        ))}
      </section>
    )}
  </>
);
export default FBTList;
