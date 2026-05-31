"use client";

import { useRef, useEffect } from "react";

const useHorizontalScroll = () => {
  const ref = useRef();

  useEffect(() => {
    const { current } = ref;
    if (current) {
      current.style.overflowX = "auto";
      current.style.whiteSpace = "nowrap";
      current.style.display = "flex";
      current.style.flexWrap = "nowrap";
      current.style.gap = "1rem";
    }
  }, []);

  return ref;
};

export default useHorizontalScroll;
