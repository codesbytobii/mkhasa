"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Wrapper } from "../../components/ui/Wrapper";
import Link from "next/link";
import { toBrandPath } from "../../utils/paths";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Brands = ({ initialBrands = [] }) => {
  const [numOfBrands, setNumOfBrands] = useState(20);

  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/all/brands`);
      if (!res.ok) throw new Error("Failed to fetch brands");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    select: (data) => (Array.isArray(data) ? data.filter((b) => b?.name) : []),
    initialData: initialBrands.length > 0 ? initialBrands : undefined,
  });

  return (
    <Wrapper className="pb-8 pt-4">
      <section className="bg-black mb-6 text-white text-center py-12">
        <h2 className="text-3xl">Explore <span className="font-semibold">Brands</span></h2>
      </section>
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {brands.slice(0, numOfBrands).map((brand, index) => (
          <Link key={index} className="border p-2 flex justify-center items-center hover:shadow-lg transition-shadow" href={toBrandPath(brand.name)}>
            <img src={brand?.image} className="w-[100%] max-w-[150px] m-auto" alt={brand?.name} />
          </Link>
        ))}
      </section>
      {brands.length > numOfBrands && (
        <p onClick={() => setNumOfBrands((p) => p + 10)} className="mt-8 text-center font-semibold cursor-pointer hover:text-app-red transition-colors">
          See more brands
        </p>
      )}
    </Wrapper>
  );
};

export default Brands;
