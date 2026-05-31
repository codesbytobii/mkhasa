"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "../utils/cn";
import { Button } from "./ui/Button";
import { format } from "../utils/lib";
import { useCartContext } from "../hooks/utils/useCart";
import StockNotification from "./StockNotification";
import { useNotificationDialogContext } from "../contexts/NotificationProvider";
import { ShoppingCart } from "lucide-react";
import { toProductPath } from "../utils/paths";

export const Product = ({
  product,
  category,
  originalPrice,
  discountedPrice,
  image,
  id,
  name,
  className,
  available
}) => {
  const [quantity, setQuantity] = useState(1);
  const [inStock, setInStock] = useState(true);
  const { toggleNotificationDialog } = useNotificationDialogContext()
  const router = useRouter();
  const { addToCart, setCartQuantity } = useCartContext();
  const productPath = toProductPath(name || product);



  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    await addToCart({
      itemId: id,
      quantity,
      applyDiscount: false,
      name,
      price: originalPrice,
      localCartImage: image,
    });
    if (window?.twq) {
      window.twq("event", "tw-pioaa-pioad", {
        value: product?.price * quantity,
        currency: "NGN",
        contents: [
          {
            content_type: "product",
            content_id: product?._id,
            content_name: product?.name,
            content_price: product?.price,
            num_items: quantity,
            content_group_id: product?.category || "discounted",
          },
        ],
        status: "started",
        conversion_id: `discount-cart-${Date.now()}`,
        // email_address: user?.email || null,
      });
    }
  };

  // console.log(name)

  return (
    <div
      // onClick={navigateToProduct}
      className={cn(
        "bg-white border-2 border-grey rounded-sm overflow-hidden h-full flex flex-col justify-between cursor-pointer",
        className
      )}
    >
      {available === false && <span className="mt-2 mr-2 text-sm bg-[#00000060] rounded text-white px-2 py-[2px] w-fit ml-auto">Sold Out</span>}
      <Link href={productPath} className="w-full aspect-square relative">
        <img
          src={image}
          alt={product || name + " product image"}
          className="h-full w-full absolute object-cover"
        />
      </Link>

      <div className="px-4 pt-2 pb-4 flex text-sm flex-col flex-grow ">
        <Link href={productPath} className="space-y-2 mb-2">
          <p className="text-[#555] font-light @[240px]:text-app-ash-2   ">
            {category}
          </p>
          <h2 className="text-app-black font-normal  pt-1 line-clamp-2  flex-grow">
            {product || name}
          </h2>
        </Link>
        <div className="mt-auto">
          <Link href={productPath}
            className={cn("gap-3 flex-col @[240px]:flex-row @[240px]:items-center @[240px]:justify-between", available === false ? "hidden" : "flex")}
          >
            <div>
              {discountedPrice ? (
                <div className="flex items-center gap-3 text-[16px]">
                  <p className="line-through text-app-ash-1 text-xs ">
                    ₦{format(originalPrice)}
                  </p>
                  <p className="font-bold text-[16px]">₦{format(discountedPrice)}</p>
                </div>
              ) : (
                <p className="font-bold text-[16px]">₦{format(originalPrice)}</p>
              )}
            </div>
          </Link>

          <div className="mt-4">
            {available === false ? (
              <Button className="btn" onClick={() => { toggleNotificationDialog(id) }}>Notify Me</Button>
            ) : (
              <div className="flex gap-2 justify-center w-full">
                <Button
                  variant="rectangle"
                  className="w-full rounded-none text-xs px-2 lg:px-2 h-10 lg:h-12 bg-transparent transition duration-300 hover:bg-black hover:text-white text-black border-black border-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-4 lg:w-5" />
                </Button>
                <div className="flex items-center justify-between lg:text-lg w-full border border-black bg-black text-white">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      decrement();
                    }}
                    className="pl-1 md:pl-2 lg:text-xl py-1"
                  >
                    -
                  </button>
                  <span className="px-0 text-xs lg:px-0 lg:text-base">
                    {quantity}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      increment();
                    }}
                    className="pr-1 md:pr-2 lg:text-xl py-1"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
