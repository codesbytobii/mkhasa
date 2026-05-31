"use client";

import { useQuery } from "@tanstack/react-query";
import { Wrapper } from "../../../components/ui/Wrapper";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const BrandHero = ({ brandName, brandDetails }) => {
  const { data: fetchedBrand } = useQuery({
    queryKey: ["brandDetails", brandName],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/product/brand/${decodeURIComponent(brandName).trim()}`);
      if (!res.ok) throw new Error("Failed to fetch brand");
      return res.json();
    },
    enabled: Boolean(brandName) && !brandDetails,
    staleTime: 5 * 60 * 1000,
  });

  const currentBrand = brandDetails || fetchedBrand || null;

  return (
    <div className="border mb-8 py-4">
      <Wrapper className="container flex h-72">
        <div className="sm:w-1/2">
          {currentBrand?.image && (
            <img src={currentBrand.image} alt={currentBrand?.name || "Brand image"} className="w-full max-w-68 h-full object-contain" />
          )}
        </div>
      </Wrapper>
    </div>
  );
};

export default BrandHero;
