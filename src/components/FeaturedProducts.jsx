"use client";

import React, { useEffect, useState } from "react";
import { SectionHeader } from "./ui/SectionHeader";
import { Product } from "./ProductCard";
import { ListGrid } from "./ui/ListGrid";
import { useLoaderData } from "@/legacy/router-shim";
import axios from "axios";

export const FeaturedProducts = () => {
  const loaderData = useLoaderData();
  const [featuredProducts, setFeaturedProducts] = useState(
    () => loaderData?.featuredProducts || []
  );
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(!loaderData?.featuredProducts?.length);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  });

  async function getFeaturedProducts() {
    try {
      const response = await api.get("/feature");
      if (typeof response?.data === 'string' && response?.data.includes('<!DOCTYPE html>')) {
        return [];
      }

      if (!Array.isArray(response?.data)) {
        return [];
      }

      return response?.data?.map(({ product }) => ({
        product: product.name,
        category: product.category,
        originalPrice: product.price,
        discountedPrice: product.discountedPrice,
        image: product.mainImage || product.firstImage || product.secondImage,
        id: product._id
      }));
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    if (loaderData?.featuredProducts?.length) return;

    async function loadFeaturedProducts() {
      try {
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (err) {
        setError("Failed to load featured products");
      } finally {
        setIsLoading(false);
      }
    }

    loadFeaturedProducts();
  }, []);



  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (featuredProducts?.length === 0) {
    return <div>No featured products available.</div>;
  }

  return (
    <section className="py-8">
      <SectionHeader header="Featured" />

      <ListGrid>
        {featuredProducts?.map(
          (
            { product, category, originalPrice, discountedPrice, image, id, available },
            index
          ) => (
            <li key={id || index} className="min-w-[11rem] md:min-w-[13rem]">
              <Product
                available={available}
                product={product}
                name={product}
                category={category}
                originalPrice={originalPrice}
                discountedPrice={discountedPrice}
                image={image}
                id={id}
              />
            </li>
          )
        )}
      </ListGrid>
    </section>
  );
};
