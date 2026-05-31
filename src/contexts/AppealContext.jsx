"use client";

import axios from "axios";
import React, { createContext, useState, useCallback } from "react";

export const AppealContext = createContext();

const AppealProvider = ({ children }) => {
  const [Appeal, setAppeal] = useState([]);
  const [appealProducts, setAppealProducts] = useState([]);
  const [fetchingAppeal, setFetchingAppeal] = React.useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


  // FETCH Appeal
  const fetchAppeal = useCallback(async (appealName) => {
    setFetchingAppeal(true);

    try {
      const response = await axios(`${baseUrl}/product/appeal/${appealName}`);
      setAppeal(response?.data);
    } catch (error) {
      console.log(error);
      //setFetchingAppeal(true);
    } finally {
      setFetchingAppeal(false);
    }
  }, [baseUrl]);

  // fetch Appeal products
  const fetchAppealProducts = useCallback(async (AppealName, page = 1) => {
    setFetchingAppeal(true);

    try {
      const response = await axios(`${baseUrl}/product/appeal/${AppealName}?page=${page}`);
      setAppealProducts(response?.data);
    } catch (error) {
      console.log(error);
      //setFetchingAppeal(true);
    } finally {
      setFetchingAppeal(false);
    }
  }, [baseUrl]);

  const fetchSortedAppealProducts = useCallback(async (sort, AppealName, page = 1) => {
    setFetchingAppeal(true);
    try {
      const res = await axios(`${baseUrl}/product/appeal/${sort}/${AppealName}?page=${page}`)
      const data = res.data
      setAppealProducts(data)
    } catch (error) {
      console.log(error)
    } finally {
      setFetchingAppeal(false);
    }
  }, [baseUrl]);

  const value = {
    Appeal,
    fetchingAppeal,
    appealProducts,
    fetchAppeal,
    fetchSortedAppealProducts,
    fetchAppealProducts
  };
  return (
    <AppealContext.Provider value={value}>{children}</AppealContext.Provider>
  );
};
export default AppealProvider;
