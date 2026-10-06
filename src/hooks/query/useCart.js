"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "../../utils/axios";
import { useAuth } from "../utils/useAuth";
import { useCartContext } from "../utils/useCart";

export const useCartQuery = () => {
  const { getUserId, authReady } = useAuth();
  const { getOrGenerateSessionId } = useCartContext();

  const userId =
    getUserId() ||
    (typeof window !== "undefined"
      ? getOrGenerateSessionId()
      : null);

  async function getCart() {
    if (!userId) return { items: [] };

    const response = await axios.get(`cart/${userId}`);
    return response?.data;
  }

  return useQuery({
    queryKey: ["cart", userId],
    queryFn: getCart,
    enabled: authReady && !!userId,
    refetchInterval: 1000 * 60,
  });
};