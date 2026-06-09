"use client";

import { useQuery } from "@tanstack/react-query";
import { Wrapper } from "../../../components/ui/Wrapper";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://mkhasa-bfdb6fabd978.herokuapp.com/api/v1";

const BrandHero = ({ brandName }) => {
  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/all/brands`);
      if (!res.ok) throw new Error("Failed to fetch brands");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    select: (data) => (Array.isArray(data) ? data.filter((b) => b?.name) : []),
  });

  const decodedName = decodeURIComponent(brandName || "").trim().toLowerCase();
  const currentBrand = brands.find(
    (b) => b.name?.trim().toLowerCase() === decodedName
  );

  if (!currentBrand?.image) return null;

  return (
    <div className="border mb-8 py-4">
      <Wrapper className="container flex h-72">
        <div className="sm:w-1/2">
          <img
            src={currentBrand.image}
            alt={currentBrand.name}
            className="w-full max-w-68 h-full object-contain"
          />
        </div>
      </Wrapper>
    </div>
  );
};

export default BrandHero;
