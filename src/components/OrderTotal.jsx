// "use client";

// import { useEffect, useState } from "react";
// import { formatCurrency } from "../utils/lib";
// import { Button } from "./ui/Button";
// import { useCartQuery } from "../hooks/query/useCart";
// import { useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { useCartContext } from "../hooks/utils/useCart";
// import { useAuth } from "../hooks/utils/useAuth";

// export const OrderTotal = ({ partial }) => {
//   const { user } = useAuth();
//   const { getCartFromLocalStorage } = useCartContext();
//   const { data } = useCartQuery();
//   const router = useRouter();
//   const queryClient = useQueryClient();

//   const guestCart = getCartFromLocalStorage();
//   const hasItems = user
//     ? (data?.items?.length > 0)
//     : (guestCart?.length > 0);

//   const proceed = () => {
//     queryClient.invalidateQueries({ queryKey: ["cart"] });
//     router.push("/checkout");
//   };

//   return (
//     <div className="py-4 md:flex md:justify-between">
//       <div className="md:mr-5">
//         <CouponCode />
//       </div>
//       <div className="border-2 border-gray-300 pt-2 lg:pt-6 pb-5 lg:pb-12 px-5 lg:px-10 w-full lg:w-[40%] mt-5 md:mt-0 flex flex-col gap-10">
//         <OrderSummary partial={partial} />
//         <div className="pt-2">
//           {hasItems && (
//             <Button
//               onClick={proceed}
//               variant="rectangle"
//               className="font-semibold text-xl py-2 w-full rounded-none text-white bg-black"
//             >
//               Checkout
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export const OrderSummary = ({ state, partial, payStackSelected }) => {
//   const { status, data } = useCartQuery();
//   const { user } = useAuth();
//   const { cartQuantityChanged, getCartFromLocalStorage } = useCartContext();
//   const [deliveryFee] = useState(2500);
//   const [guestSubtotal, setGuestSubtotal] = useState(0);

//   const isGuest = !user;
//   const guestCart = getCartFromLocalStorage();

//   useEffect(() => {
//     if (isGuest) {
//       const total = guestCart.reduce(
//         (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
//         0
//       );
//       setGuestSubtotal(total);
//     }
//   }, [cartQuantityChanged, isGuest, guestCart.length]);

//   if (!isGuest && status === "pending") {
//     return <p className="text-sm text-gray-500">Loading cart...</p>;
//   }

//   const subtotal = isGuest ? guestSubtotal : (data?.subTotal || 0);
//   const items = isGuest ? guestCart : data?.items;

//   if (!items || items.length === 0) return null;

//   return (
//     <div className="font-normal pt-2 md:p-0">
//       <h2 className="text-lg font-semibold pb-4">Cart Summary</h2>
//       <div className="flex flex-col gap-1 lg:gap-3">
//         <div className="flex justify-between py-2">
//           <span className="font-semibold">Subtotal:</span>
//           <span className="font-semibold">{formatCurrency(subtotal, "NGN")}</span>
//         </div>
//         <div className="flex justify-between py-2">
//           <span className="font-semibold">Delivery Fee:</span>
//           <span className="font-semibold">₦{deliveryFee.toLocaleString()}</span>
//         </div>
//         {payStackSelected && (
//           <div className="flex justify-between py-2">
//             <span className="font-semibold">Surcharge:</span>
//             <span className="font-semibold">1.4%</span>
//           </div>
//         )}
//         <div className="flex justify-between py-2 border-t mt-2 pt-4">
//           <span className="font-semibold text-lg">Total:</span>
//           <span className="font-semibold text-lg">
//             {formatCurrency(subtotal + deliveryFee, "NGN")}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// const CouponCode = () => (
//   <div className="bg-red-100 overflow-hidden relative max-w-lg md:w-[400px]">
//     <input
//       type="text"
//       className="py-2 w-full pl-4 pr-32 outline-none bg-transparent"
//       placeholder="Enter Discount Code"
//     />
//     <button className="bg-app-black absolute right-0 top-0 bottom-0 w-28 text-white">
//       Apply
//     </button>
//   </div>
// );



"use client";

import { formatCurrency } from "../utils/lib";
import { Button } from "./ui/Button";
import { useCartQuery } from "../hooks/query/useCart";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const OrderTotal = ({ partial }) => {
  const { data } = useCartQuery();
  const router = useRouter();
  const queryClient = useQueryClient();

  const hasItems = (data?.items?.length || 0) > 0;

  const proceed = () => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
    router.push("/checkout");
  };

  return (
    <div className="py-4 md:flex md:justify-between">
      <div className="md:mr-5">
        <CouponCode />
      </div>
      <div className="border-2 border-gray-300 pt-2 lg:pt-6 pb-5 lg:pb-12 px-5 lg:px-10 w-full lg:w-[40%] mt-5 md:mt-0 flex flex-col gap-10">
        <OrderSummary partial={partial} />
        <div className="pt-2">
          {hasItems && (
            <Button
              onClick={proceed}
              variant="rectangle"
              className="font-semibold text-xl py-2 w-full rounded-none text-white bg-black"
            >
              Checkout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export const OrderSummary = ({ state, partial, payStackSelected }) => {
  const { status, data } = useCartQuery();
  const DELIVERY_FEE = 2500;

  if (status === "pending") {
    return <p className="text-sm text-gray-500">Loading cart...</p>;
  }

  const items = data?.items || [];
  if (items.length === 0) return null;

  // subTotal comes from server for both guests (sessionId) and logged-in users
  const subtotal = data?.subTotal ||
    items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <div className="font-normal pt-2 md:p-0">
      <h2 className="text-lg font-semibold pb-4">Cart Summary</h2>
      <div className="flex flex-col gap-1 lg:gap-3">
        <div className="flex justify-between py-2">
          <span className="font-semibold">Subtotal:</span>
          <span className="font-semibold">{formatCurrency(subtotal, "NGN")}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="font-semibold">Delivery Fee:</span>
          <span className="font-semibold">₦{DELIVERY_FEE.toLocaleString()}</span>
        </div>
        {payStackSelected && (
          <div className="flex justify-between py-2">
            <span className="font-semibold">Surcharge:</span>
            <span className="font-semibold">1.4%</span>
          </div>
        )}
        <div className="flex justify-between py-2 border-t mt-2 pt-4">
          <span className="font-semibold text-lg">Total:</span>
          <span className="font-semibold text-lg">
            {formatCurrency(subtotal + DELIVERY_FEE, "NGN")}
          </span>
        </div>
      </div>
    </div>
  );
};

const CouponCode = () => (
  <div className="bg-red-100 overflow-hidden relative max-w-lg md:w-[400px]">
    <input
      type="text"
      className="py-2 w-full pl-4 pr-32 outline-none bg-transparent"
      placeholder="Enter Discount Code"
    />
    <button className="bg-app-black absolute right-0 top-0 bottom-0 w-28 text-white">
      Apply
    </button>
  </div>
);