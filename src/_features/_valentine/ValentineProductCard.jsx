"use client";

import React, { useState, useContext } from 'react';
import { useRouter } from "next/navigation";
// import { cn } from "../utils/cn";
// import { Button } from "./ui/Button";
// import { format } from "../utils/lib";
// import { useCartContext } from '../hooks/utils/useCart';
import { cn } from '../../utils/cn';
import { Button } from '../../components/ui/Button';
import { useCartContext } from '../../hooks/utils/useCart';
import { format } from "../../utils/lib";
import { Images } from '../../data/Images';
import { Minus, Plus } from 'lucide-react';
import { toProductPath } from '../../utils/paths';
export const ValentineProductCard = ({
  product,
  category,
  originalPrice,
  discountedPrice,
  image,
  id,
  className,
}) => {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addToCart } = useCartContext();

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const success = await addToCart({ itemId: id, quantity });
  };

  const navigateToProduct = () => router.push(toProductPath(product));

  return (
    <div
      onClick={navigateToProduct}
      className={cn(
        "bg-white border-2 border-grey rounded-sm overflow-hidden h-full flex flex-col justify-between relative   cursor-pointer",
      )}
    >
        <img src={Images.LoveIcon} alt="" className='z-20 w-6 absolute top-4 right-4' onClick={(e)=>{
            e.stopPropagation()
            alert()
        }} />
      <div className="w-full aspect-square relative">
        <img
          src={image}
          alt={product}
          className="h-full w-full absolute object-cover"
        />
      </div>

      <div className="px-4 pt-2 pb-4 flex text-sm flex-col flex-grow">
        <p className="text-[#555] font-light @[240px]:text-app-ash-2   ">
          {category}
        </p>
        <h2 className="text-app-black font-bold text-[16px] pt-1 line-clamp-4 flex-grow">
          {product}
        </h2>
        <div className="mt-auto">
          <div className="flex gap-3 flex-col @[240px]:flex-row @[240px]:items-center @[240px]:justify-between">
            <div>
              {discountedPrice ? (
                <div className="flex items-center gap-3">
                  <p className="line-through text-app-ash-1 text-xs font-inter">
                    ₦{format(originalPrice)}
                  </p>
                  <p className='font-inter'>₦{format(discountedPrice)}</p>
                </div>
              ) : (
                <p className='font-inter'>₦{format(originalPrice)}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 justify-center w-full mt-2">
            <Button
              variant="rectangle"
              className="w-full rounded-none text-xs px-2 lg:px-2 h-10 lg:h-12 bg-transparent transition duration-300 hover:bg-app-red hover:border-none hover:text-white text-app-red border-app-red border-2"
              onClick={handleAddToCart}
            >
              Send as a Gift
            </Button>
            <div className="flex items-center justify-between gap-2 lg:text-lg w-full border border-black bg-black text-white">
              <button onClick={(e) => { e.stopPropagation(); decrement(); }} className="pl-1 md:pl-2 lg:text-xl py-1">
                <Minus />
              </button>
              <span className="px-0 text-xs lg:px-0 lg:text-base">{quantity}</span>
              <button onClick={(e) => { e.stopPropagation(); increment(); }} className="pr-1 md:pr-2 lg:text-xl py-1">
                <Plus />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



// export default ValentineProductCard
