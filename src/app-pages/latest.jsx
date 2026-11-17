// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Wrapper } from "../components/ui/Wrapper";
// import { SectionHeader } from "../components/ui/SectionHeader";
// import { Product } from "../components/ProductCard";
// import LoadingSpinner from "../components/LoadingSpinner";

// const FALLBACK_IMAGE = "/placeholder.jpg";
// const LATEST_PRODUCTS_URL =
//   "https://mkhasa-bfdb6fabd978.herokuapp.com/api/v1/all/products/latest";

// export const Component = () => {
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const controller = new AbortController();

//     const fetchProducts = async () => {
//       try {
//         const res = await axios.get(LATEST_PRODUCTS_URL, {
//           signal: controller.signal,
//         });
//         const list = Array.isArray(res.data) ? res.data : res.data?.products;
//         setProducts(list || []);
//         setError(null);
//       } catch (err) {
//         if (axios.isCancel(err) || controller.signal.aborted) return;
//         console.error("Error fetching latest products:", err);
//         setError("An error has occurred");
//       } finally {
//         // Only stop loading if this request wasn't aborted
//         if (!controller.signal.aborted) setIsLoading(false);
//       }
//     };

//     fetchProducts();
//     return () => controller.abort();
//   }, []);

//   if (isLoading) return <LoadingSpinner />;

//   return (
//     <section>
//       <Wrapper className="py-6">
//         <div className="py-4">
//           <SectionHeader header="New In" className="text-nowrap" />
//         </div>

//         {error ? (
//           <p>{error}</p>
//         ) : products.length === 0 ? (
//           <p>No products found.</p>
//         ) : (
//           <ul className="grid justify-center grid-flow-row grid-cols-2 gap-1 pt-8 auto-rows-fr sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
//             {products.map((product) => (
//               <li key={product._id}>
//                 <Product
//                   product={product.name}
//                   name={product.name}
//                   category={product.category}
//                   originalPrice={product.price}
//                   discountedPrice={product?.discountedPrice}
//                   image={product.mainImage || product.imageUrl || FALLBACK_IMAGE}
//                   id={product._id}
//                   available={product.available}
//                 />
//               </li>
//             ))}
//           </ul>
//         )}
//       </Wrapper>
//     </section>
//   );
// };

"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Wrapper } from "../components/ui/Wrapper";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Product } from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

const FALLBACK_IMAGE = "/placeholder.jpg";
const LATEST_PRODUCTS_URL =
  "https://mkhasa-bfdb6fabd978.herokuapp.com/api/v1/all/products/latest";
const PAGE_SIZE = 20;

export const Component = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const sentinelRef = useRef(null);

  // Load the current page
  useEffect(() => {
    const controller = new AbortController();

    const loadPage = async () => {
      setIsFetching(true);
      try {
        const res = await axios.get(LATEST_PRODUCTS_URL, {
          params: { page, pageSize: PAGE_SIZE },
          signal: controller.signal,
        });

        const data = res.data;
        const list = Array.isArray(data) ? data : data?.products || [];

        // Append, skipping any product we already have
        setProducts((prev) => {
          const seen = new Set(prev.map((p) => p._id));
          return [...prev, ...list.filter((p) => !seen.has(p._id))];
        });

        // Use the API's pagination info if it sends it, otherwise
        // assume there are more pages while we keep getting full pages
        const pagination = data?.pagination || data;
        if (typeof pagination?.hasNextPage === "boolean") {
          setHasMore(pagination.hasNextPage);
        } else if (pagination?.totalPages) {
          setHasMore(page < pagination.totalPages);
        } else {
          setHasMore(list.length >= PAGE_SIZE);
        }

        setError(null);
      } catch (err) {
        if (axios.isCancel(err) || controller.signal.aborted) return;
        console.error("Error fetching latest products:", err);
        setError("An error has occurred");
      } finally {
        if (!controller.signal.aborted) setIsFetching(false);
      }
    };

    loadPage();
    return () => controller.abort();
  }, [page, retryKey]);

  // Ask for the next page when the bottom marker scrolls into view
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || isFetching || !hasMore || error) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setPage((p) => p + 1);
      },
      { rootMargin: "400px" } // start loading before the user hits the bottom
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isFetching, hasMore, error, products.length]);

  const handleRetry = () => {
    setError(null);
    setRetryKey((k) => k + 1);
  };

  // First load only
  if (products.length === 0 && isFetching) return <LoadingSpinner />;

  return (
    <section>
      <Wrapper className="py-6">
        <div className="py-4">
          <SectionHeader header="New In" className="text-nowrap" />
        </div>

        {products.length === 0 && !error ? (
          <p>No products found.</p>
        ) : (
          <ul className="grid justify-center grid-flow-row grid-cols-2 gap-1 pt-8 auto-rows-fr sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
              <li key={product._id} className="min-w-0">
                <Product
                  product={product.name}
                  name={product.name}
                  category={product.category}
                  fragranceFamily={product.fragranceFamily}
                  originalPrice={product.originalPrice}
                  discountedPrice={product?.discountedPrice}
                  image={product.mainImage || product.imageUrl || FALLBACK_IMAGE}
                  id={product._id}
                  available={product.available}
                />
              </li>
            ))}
          </ul>
        )}

        {/* Bottom of the list */}
        <div ref={sentinelRef} className="flex justify-center py-8">
          {isFetching && products.length > 0 ? (
            <p className="text-sm text-gray-500">Loading more...</p>
          ) : error ? (
            <div className="text-center">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={handleRetry}
                className="mt-2 bg-black px-4 py-2 text-sm text-white"
              >
                Try again
              </button>
            </div>
          ) : !hasMore && products.length > 0 ? (
            <p className="text-sm text-gray-500">You&apos;ve reached the end.</p>
          ) : null}
        </div>
      </Wrapper>
    </section>
  );
};