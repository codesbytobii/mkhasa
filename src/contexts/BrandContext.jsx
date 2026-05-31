"use client";

import axios from "axios";
import React, { createContext, useState } from "react";
export const BrandContext = createContext();

const BrandProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  const [brandsProducts, setBrandsProducts] = useState([{}]);
  const [brandsProductsData, setBrandsProductsData] = useState([]);
  const [fetchingBrand, setFetchingBrand] = React.useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sorted, setSorted] = useState("")
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  React.useEffect(() => {
    fetchBrands();
  }, []);

  // FETCH BRANDS
  const fetchBrands = async () => {
    setFetchingBrand(true);

    try {
      const response = await axios(`${baseUrl}/all/brands`);
      setBrands(response?.data);
    } catch (error) {
      setFetchingBrand(true);
    } finally {
      setFetchingBrand(false);
    }
  };

  // fetch brand products
  const fetchBrandProducts = async (brandName, page = 1, recalling = false) => {
    setFetchingBrand(true);
    const decoded = decodeURIComponent(brandName)
    try {
      const { data } = await axios(`${baseUrl}/product/brand/${decoded.trim()}?page=${page}`);
      if (recalling) {
        setBrandsProducts(prev => [...prev, ...data.products])
      } else {
        setBrandsProducts(data.products)
      }
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setBrandsProductsData(data)
    } catch (error) {
      setFetchingBrand(true);
    } finally {
      setFetchingBrand(false);
      setSorted("")
    }
  }



  const fetchSortedBrandProducts = async (sort, brandName, page = 1, recalling) => {
    setFetchingBrand(true)
    const decoded = decodeURIComponent(brandName)
    try {
      const res = await axios(`${baseUrl}/product/brand/${sort}/${decoded.trim()}?page=${page}`)
      const data = res.data
      if (recalling) {
        setBrandsProducts(prev => [...prev, ...data.products])
      } else {
        setBrandsProducts(data.products)
      }
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setBrandsProductsData(data)
    } catch (error) {
    } finally {
      setSorted(sort)
      setFetchingBrand(false)
    }
  }

  const value = {
    brands,
    fetchingBrand,
    brandsProducts,
    brandsProductsData,
    currentPage,
    totalPages,
    sorted,
    fetchBrands,
    fetchSortedBrandProducts,
    fetchBrandProducts
  };
  return (
    <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
  );
};
export default BrandProvider;
