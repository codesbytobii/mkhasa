"use client";


import { ChevronRight } from "lucide-react";

export const CustomNextButton = ()=> {
  const { scrollNext } = useCarousel()

  return (
    <button
      onClick={scrollNext}
      className="right-0 absolute top-1/2 -translate-y-1/2 bg-white border flex items-center justify-center h-8 w-8"
    >
      <ChevronRight className="w-4 h-4 text-black" />
    </button>
  );
}

export const CustomPrevButton = ()=> {
  const {  } = useCarousel();
  

  return (
    <button
      onClick={scrollNext}
      className="right-0 absolute top-1/2 -translate-y-1/2 bg-white border flex items-center justify-center h-8 w-8"
    >
      <ChevronRight className="w-4 h-4 text-black" />
    </button>
  );
}
