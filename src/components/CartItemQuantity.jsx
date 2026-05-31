"use client";

import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { Button } from "./ui/Button";
import { Icon } from "@iconify/react";
import { useCartContext } from "../hooks/utils/useCart";
import { getSingleProduct } from "../utils/productApi";

export const CartItemQuantity = ({ productId, quantity, applyDiscount, originalPrice }) => {
  const { decreaseItem, increaseItem } = useCartContext();
  const [showModal, setShowModal] = useState(false);
  const [qty, setQty] = useState(quantity);
  const [productPrice, setProductPrice] = useState(originalPrice);
  const [productSeries, setProductSeries] = useState(null);

  useEffect(() => {
    setQty(quantity);
    getSingleProduct(productId).then((product) => {
      if (product) {
        setProductSeries(product.series ?? null);
        setProductPrice(product.price ?? originalPrice);
      }
    });
  }, [quantity, productId, originalPrice]);

  return (
    <div className="flex items-center justify-center mb-2 md:mb-0">
      <button
        disabled={qty === 1}
        onClick={() => {
          decreaseItem({ quantity: 1, itemId: productId, productPrice, series: productSeries });
          setQty((prev) => prev - 1);
        }}
        className="h-8 w-8 flex items-center justify-center text-2xl border border-[#F5F5F5] bg-[#F5F5F5]"
      >
        <Icon icon="tdesign:minus" />
      </button>
      <input
        type="number"
        value={qty}
        readOnly
        className="w-12 h-8 text-center md:text-right mx-auto flex justify-center items-center border border-[#F5F5F5] text-lg bg-[#F5F5F5]"
      />
      <button
        onClick={() => {
          increaseItem({ quantity: 1, itemId: productId, applyDiscount, productPrice, series: productSeries });
          setQty((prev) => prev + 1);
        }}
        className="h-8 w-8 flex items-center justify-center text-2xl border border-[#F5F5F5] bg-[#F5F5F5]"
      >
        <Icon icon="tdesign:plus" />
      </button>

      {showModal && (
        <Modal title="Remove Item From Cart?">
          <p>Are you sure you want to remove this item?</p>
          <div className="flex gap-12 justify-center items-center pt-8">
            <button onClick={() => setShowModal(false)}>Cancel</button>
            <Button
              className="bg-app-black text-white font-bold"
              onClick={() => setShowModal(false)}
            >
              Remove
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
