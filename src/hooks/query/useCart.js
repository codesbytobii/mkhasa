"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "../../utils/axios";
import { useAuth } from "../utils/useAuth";
import { getCartFromLocalStorage } from "../../contexts/Cart";
import { useCartContext } from "../utils/useCart";

export const useCartQuery = () => {
  const { getUserId } = useAuth();
  const { getOrGenerateSessionId } = useCartContext();

  const userId =
    getUserId() ||
    (typeof window !== "undefined" ? getOrGenerateSessionId() : null);

  async function getCart() {
    if (!userId) return { items: [] };
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/${userId}`);
    return response?.data;
  }

  return useQuery({
    queryKey: ["cart", userId],  // <-- IMPORTANT FIX
    queryFn: getCart,
    enabled: !!userId,
    refetchInterval: 1000 * 60,
  });
};



