"use client";

import axios from "axios";
import { createContext, useContext, useState } from "react";

const ProductContext = createContext()
export const useProductContext = () => useContext(ProductContext)

const ProductsProvider = ({ children }) => {
    const [allProducts, setAllProducts] = useState()
    const [loadingProducts, setLoadingProducts] = useState(false)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    // GET ALL PRODUCTS
    const getProducts = async () => {
        setLoadingProducts(true)
        try {
            const response = await axios(`${baseUrl}/all/products`)
            const data = response?.data
            setAllProducts(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingProducts(false)
        }
    }

    const getSingleProduct = async (id) => {
        setLoadingProducts(true)
        try {
            const response = await axios(`${baseUrl}/products/${id}`)
            const data = response?.data
            return data
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingProducts(false)
        }
    }

    const getSeries = async (id) => {
        setLoadingProducts(true)
        try {
            const response = await axios(`${baseUrl}/all/series`)
            const data = response?.data
            return data
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingProducts(false)
        }
    }

    const getSingleSeries = async (seriesName) => {
        const seriesList = await getSeries()
        try {
            const series = seriesList.find(ser => ser.name === seriesName)
            return series
        } catch (error) {
            console.log(error)
        }
    }

    const getNicheFragrances = async () => {
        setLoadingProducts(true)
        try {
            const response = await axios(`${baseUrl}/all/products`)
            const data = response?.data
            setAllProducts(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingProducts(false)
        }
    }

    const value = {
        getSingleProduct,
        getProducts,
        getSingleSeries,
        allProducts,
        loadingProducts
    }
    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export default ProductsProvider