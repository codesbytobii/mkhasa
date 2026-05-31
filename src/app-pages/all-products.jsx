"use client";

// pages/all-products.jsx
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { toProductPath } from "../utils/paths";

export const Component = ({ initialData }) => {
  const initialProducts = initialData?.getAllProducts || [];
  const initialPagination = initialData?.pagination || {};

  const [products, setProducts] = useState(initialProducts);
  const [currentPage, setCurrentPage] = useState(initialPagination.currentPage || 1);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages || 1);
  const [isLoading, setIsLoading] = useState(initialProducts.length === 0);
  const [error, setError] = useState(null);
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const PRODUCTS_PER_PAGE = 50; // Increased from 20 for better UX

  const fetchProducts = async (page) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${baseUrl}/all/products?page=${page}&limit=${PRODUCTS_PER_PAGE}`
      );
      if (response.data?.getAllProducts) {
        if (page === 1) {
          setProducts(response.data.getAllProducts);
        } else {
          setProducts(prev => [...prev, ...response.data.getAllProducts]);
        }
        setTotalPages(response.data.pagination.totalPages || 1);
      }
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialProducts.length > 0) return;
    fetchProducts(1);
  }, [initialProducts.length]);

  const loadMore = () => {
    if (currentPage < totalPages && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  return (
    <div className="all-products p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">All Products ({products.length}+)</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {products.map(product => (
          <Link
            key={product._id}
            href={toProductPath(product.name)}
            className="block p-4 border rounded-lg hover:shadow-lg transition-shadow"
          >
            {product.mainImage && (
              <img 
                src={product.mainImage} 
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-2"
              />
            )}
            <h2 className="font-semibold text-lg mb-1">{product.name}</h2>
            <p className="text-gray-600">₦{product.price?.toLocaleString()}</p>
            {!product.available && (
              <span className="text-sm text-red-500">Sold Out</span>
            )}
          </Link>
        ))}
      </div>

      {currentPage < totalPages && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Loading...' : 'Load More Products'}
          </button>
        </div>
      )}
    </div>
  );
};
