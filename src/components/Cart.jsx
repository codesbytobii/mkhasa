"use client";

import { useEffect } from "react";
import { useCartQuery } from "../hooks/query/useCart";
import { useCartContext } from "../hooks/utils/useCart";
import { CartItem } from "./CartItem";

export const Cart = () => {
  return (
    <div className="bg-white py-6 px-4 rounded-3xl my-4 md:px-0">
      <div className="grid items-center font-bold font-    border-b-2 pb-4 grid-cols-12">
        <p className="md:col-span-6">Product</p>
        <div className="hidden md:grid items-center md:col-span-6 grid-cols-1 md:grid-cols-6">
          <p className="text-center md:col-span-2">Quantity</p>
          <p className="text-center md:col-span-2">Unit Price</p>
          <p className="text-center md:col-span-2">Subtotal</p>
        </div>
      </div>
      <CartItems />
    </div>
  );
};

export const CartItems = ({ isCheckout }) => {
  const { status, data } = useCartQuery();

  return status === "pending" ? (
    "Loading Cart"
  ) : !data?.items || data.items.length === 0 ? (
    <p className="pt-4">You have not selected any item for purchase</p>
  ) : (
    <ul>
      {data.items.map((item, i) => (
        <li key={i} className="py-3">
          <CartItem item={item} isCheckout={isCheckout} />
        </li>
      ))}
    </ul>
  );
};




