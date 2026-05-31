"use client";

import { SectionHeader } from "./ui/SectionHeader";
import { Product } from "./ProductCard";
import { ListGrid } from "./ui/ListGrid";
import { useLoaderData } from "@/legacy/router-shim";

export const NewArrivals = () => {
  const { featuredProducts } = useLoaderData();
  console.log(featuredProducts)

  return (
    <section className="py-8      ">
      <SectionHeader header="Deals" />

      <ListGrid>
        {featuredProducts?.map(
          (
            { product, category, originalPrice, discountedPrice, image, id, available, name },
            index
          ) => (
            <li key={index} className="min-w-[13rem]">
              <Product
                available={available}
                product={product}
                category={category}
                originalPrice={originalPrice}
                discountedPrice={discountedPrice}
                image={image}
                id={id}
                name={name}
              />
            </li>
          )
        )}
      </ListGrid>
    </section>
  );
};
