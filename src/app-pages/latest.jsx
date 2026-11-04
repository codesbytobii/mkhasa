"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Wrapper } from "../components/ui/Wrapper";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Product } from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

const FALLBACK_IMAGE = "/placeholder.jpg";
const LATEST_PRODUCTS_URL =
  "https://mkhasa-bfdb6fabd978.herokuapp.com/api/v1/all/products/latest";

export const Component = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        const res = await axios.get(LATEST_PRODUCTS_URL, {
          signal: controller.signal,
        });
        const list = Array.isArray(res.data) ? res.data : res.data?.products;
        console.log(list);
        setProducts(list || []);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("Error fetching latest products:", err);
        setError("An error has occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <section>
      <Wrapper className="py-6">
        <div className="py-4">
          <SectionHeader header="New In" className="text-nowrap" />
        </div>

        {error ? (
          <p>{error}</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <ul className="grid justify-center grid-flow-row grid-cols-2 gap-1 pt-8 auto-rows-fr sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
              <li key={product._id}>
                <Product
                  product={product.name}
                  name={product.name}
                  category={product.category}
                  originalPrice={product.price}
                  discountedPrice={product?.discountedPrice}
                  image={product.mainImage || product.imageUrl || FALLBACK_IMAGE}
                  id={product._id}
                  available={product.available}
                />
              </li>
            ))}
          </ul>
        )}
      </Wrapper>
    </section>
  );
};