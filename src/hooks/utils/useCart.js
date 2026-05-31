"use client";

import { CartContext } from "../../contexts/Cart";
import { useContext } from "react";

export const useCartContext = () => useContext(CartContext);
