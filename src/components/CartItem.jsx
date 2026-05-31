"use client";

import { Icon } from "@iconify/react";
import { CartItemQuantity } from "./CartItemQuantity";
import { Modal } from "./Modal";
import { Button } from "./ui/Button";
import { useState } from "react";
import { useCartContext } from "../hooks/utils/useCart";
// import toast from "react-hot-toast";

export const CartItem = ({ item, isCheckout }) => {
  const [showModal, setShowModal] = useState(false);
  const { removeFromCart } = useCartContext();

  return (
    <div className="text-sm border-b-2 pb-3 sm:text-md">
      <div className="grid grid-cols-12 items-center">
        <div className="flex items-center gap-2 col-span-9 md:col-span-6 md:gap-4">
          <div className="w-20 min-h-[96px] bg-white">
            <img
              src={item?.productId?.mainImage || item.localCartImage}
              alt={item?.productId?.name + " main-image"}
              className=" md:w-44 md:h-24 md:object-cover w-full h-full object-cover"
            />
          </div>

          <div>
            <p className="line-clamp-1">{item?.productId?.name || item.name}</p>
            <button
              className="inline-flex items-center gap-2 mt-1 hover:bg-app-ash-1 rounded-sm"
              onClick={() => {
                setShowModal(true);
              }}
            >
              <Icon icon="uil:times" style={{ fontSize: 24 }} /> Remove
            </button>
          </div>
        </div>
        {isCheckout ? (
          <div className="col-span-3 md:gap-2 sm:col-span-1 items-center md:col-span-6 grid grid-cols-1">
            <div className="grid items-center justify-end md:items-start md:text-center">
              <CartItemQuantity
              originalPrice={item?.productId?.price || item.price}
                quantity={item?.quantity}
                productId={item?.productId._id || item.id}
                applyDiscount={item?.applyDiscount}
              />
            </div>

            <p className="text-right md:text-right font-inter">
              ₦{(item?.quantity * item?.price).toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="col-span-3 sm:col-span-1 items-center md:col-span-6 grid grid-cols-1 md:grid-cols-6 ">


            <div className="grid items-center md:col-span-2 justify-end md:justify-center md:items-start md:text-center">
              <CartItemQuantity
              originalPrice={item?.productId?.price || item.price}
                quantity={item?.quantity}
                productId={item?.productId?._id || item.productId}
                applyDiscount={item?.applyDiscount}
              />
            </div>

            <p className="hidden md:block md:text-center md:col-span-2 font-inter">
              ₦{(item?.price).toLocaleString()}
            </p>

            <p className="text-right md:text-center md:col-span-2 font-inter">
              ₦{(item?.quantity * item?.price).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Remove Item From Cart?">
          <p className="text-center p-4">
            Are you sure you want to remove this item?
          </p>
          <div className="flex gap-4 justify-center items-center pt-8 flex-wrap">
            <button
              className="bg-gray-200 text-black py-2 px-4 rounded-full w-28"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Cancel
            </button>
            <Button
              className="bg-app-black text-white py-2 px-4 rounded-full font-bold font-    w-28"
              onClick={() => {
                removeFromCart(item?.productId?._id || item.productId);
                setShowModal(false);
              }}
            >
              Remove
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};