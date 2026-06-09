"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "../../utils/axios";

const API_BASE =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://mkhasa-bfdb6fabd978.herokuapp.com/api/v1";

export const useCategory = () => {
  async function getCategories() {
    const response = await axios.get(`${API_BASE}/all/category`);
    // console.log(response)
    return response?.data;
  }
  const {
    data: categories,
    error,
    status,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return {
    categories,
    error,
    status,
  };
};
