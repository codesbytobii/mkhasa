// // "use client";

// // import { useEffect, useState } from "react";
// // import { getCartFromLocalStorage } from "../contexts/Cart";
// // import { useCartQuery } from "../hooks/query/useCart";
// // import { CartItem } from "./CartItem";
// // import { useCartContext } from "../hooks/utils/useCart";

// // export const GuestCart = () => {
// //   return (
// //     <div className="bg-white py-6 px-4 rounded-3xl my-4 md:px-0">
// //       <div className="grid items-center font-bold font-    border-b-2 pb-4 grid-cols-12">
// //         <p className="md:col-span-6">Product</p>
// //         <div className="hidden md:grid items-center md:col-span-6 grid-cols-1 md:grid-cols-6">
// //           <p className="text-center md:col-span-2">Quantity</p>
// //           <p className="text-center md:col-span-2">Unit Price</p>
// //           <p className="text-center md:col-span-2">Subtotal</p>
// //         </div>
// //       </div>
// //       <CartItems />

// //     </div>
// //   );
// // };

// // export const CartItems = ({ isCheckout }) => {
// //   const [guestCart, setGuestCart] = useState(getCartFromLocalStorage() || [])
// //   const {setCartQuantityChanged, cartQuantityChanged, canRefetch} = useCartContext()
// //   useEffect(() => {
// //     const updateData = () => {
// //       const data = getCartFromLocalStorage()
// //       setGuestCart(data)
// //       setCartQuantityChanged(false)
// //     }
// //     updateData()
// //   }, [cartQuantityChanged, canRefetch])

// //   return (
// //     <>
// //       {!guestCart || guestCart.length === 0 ? (
// //         <p className="pt-4">guestYou have not selected any item for purchase</p>
// //       ) : (
// //         <ul>
// //           {guestCart.map((item, i) => (
// //             <li key={i} className="py-3">
// //               <CartItem item={item} isCheckout={isCheckout} />
// //             </li>
// //           ))}
// //         </ul>
// //       )}
// //     </>
// //   );
// // };


// "use client";

// import { useEffect, useState } from "react";
// import { useCartQuery } from "../hooks/query/useCart";
// import { CartItem } from "./CartItem";
// import { useCartContext } from "../hooks/utils/useCart";
// import LoadingSpinner from "./LoadingSpinner";
// import Link from "next/link";

// export const GuestCart = () => {
//   return (
//     <div className="bg-white py-6 px-4 rounded-3xl my-4 md:px-0">
//       <div className="grid items-center font-bold border-b-2 pb-4 grid-cols-12">
//         <p className="md:col-span-6">Product</p>
//         <div className="hidden md:grid items-center md:col-span-6 grid-cols-1 md:grid-cols-6">
//           <p className="text-center md:col-span-2">Quantity</p>
//           <p className="text-center md:col-span-2">Unit Price</p>
//           <p className="text-center md:col-span-2">Subtotal</p>
//         </div>
//       </div>
//       <CartItems />
//     </div>
//   );
// };

// export const CartItems = ({ isCheckout }) => {
//   const { data, status } = useCartQuery();
//   const { canRefetch } = useCartContext();

//   if (status === "pending") return <LoadingSpinner />;

//   const items = data?.items || [];

//   if (items.length === 0) {
//     return (
//       <div className="py-8 text-center">
//         <p className="text-gray-500 mb-4">Your cart is empty.</p>
//         <Link
//           href="/all-products"
//           className="inline-block bg-black text-white px-6 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors"
//         >
//           Continue Shopping
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <ul>
//       {items.map((item, i) => (
//         <li key={item?.productId?._id || item?.productId || i} className="py-3">
//           <CartItem item={item} isCheckout={isCheckout} />
//         </li>
//       ))}
//     </ul>
//   );
// };



"use client";

import { useState, useEffect } from "react";
import { getCartFromLocalStorage } from "../contexts/Cart";
import { CartItem } from "./CartItem";
import { useCartContext } from "../hooks/utils/useCart";

export const GuestCart = () => {
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
  const [guestCart, setGuestCart] = useState([]);
  const { setCartQuantityChanged, cartQuantityChanged, canRefetch } = useCartContext();

  useEffect(() => {
    const data = getCartFromLocalStorage();
    setGuestCart(data);
    setCartQuantityChanged(false);
  }, [cartQuantityChanged, canRefetch]);

  return (
    <>
      {!guestCart || guestCart.length === 0 ? (
        <p className="pt-4">You have not selected any item for purchase</p>
      ) : (
        <ul>
          {guestCart.map((item, i) => (
            <li key={i} className="py-3">
              <CartItem item={item} isCheckout={isCheckout} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};