"use client";

import { useEffect, useRef } from "react";

export default function ViewContentTracker({ product }) {
  const lastTrackedProduct = useRef(null);

  useEffect(() => {
    if (!product) return;

    const productId = String(
      product._id ?? product.barcode ?? product.name ?? ""
    );

    if (!productId || lastTrackedProduct.current === productId) return;

    let attempts = 0;
    let timer;

    const trackView = () => {
      if (typeof window.fbq === "function") {
        const price = Number(product.price);

        window.fbq("track", "ViewContent", {
          content_name: product.name || "Product",
          content_ids: [productId],
          content_type: "product",
          ...(Number.isFinite(price) && price >= 0
            ? { value: price, currency: "NGN" }
            : {}),
        });

        lastTrackedProduct.current = productId;
        return;
      }

      attempts += 1;

      if (attempts < 20) {
        timer = setTimeout(trackView, 250);
      }
    };

    trackView();

    return () => clearTimeout(timer);
  }, [product]);

  return null;
}