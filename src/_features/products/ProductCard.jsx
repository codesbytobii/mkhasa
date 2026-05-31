"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useState } from "react";
import { useCartContext } from "../../hooks/utils/useCart";
import Link from "next/link";
import { toProductPath } from "../../utils/paths";

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartContext();
  const productPath = toProductPath(product?.name);

  return (
    <div className="border p-2 flex flex-col justify-between">
      <div>
        <Link className="block h-[250px]" href={productPath}>
          <img
            src={product.mainImage}
            alt={product?.name + " product image"}
            className="h-full object-contain m-auto"
          />
        </Link>
        <Link href={productPath}
          className="text-lg font-medium leading-5 "
        >
          {product.name}
        </Link>
      </div>
      <div>
        <span className="mt-2 block font-inter">₦{product?.price.toLocaleString()}</span>
        <div className="flex gap-2 mt-auto items-center ">
          <Button
            className="mt-auto border p-1 rounded-none border-black text-xs text-black hover:bg-[#000] hover:text-white transition-all min-w-fit"
            onClick={() => {
              addToCart({ itemId: product._id, quantity });
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
                      content_group_id:
                        product?.category || "discounted",
                    },
                  ],
                  status: "started",
                  conversion_id: `discount-cart-${Date.now()}`,
                  // email_address: user?.email || null,
                });
              }
            }}
          >
            Add to cart
          </Button>
          <div className="bg-black text-white items-center flex px-1 gap-1">
            <span
              onClick={() => {
                setQuantity((prev) => prev - 1);
              }}
            >
              -
            </span>
            <span className="text-xs">{quantity}</span>
            <span
              onClick={() => {
                setQuantity((prev) => prev + 1);
              }}
            >
              +
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
