"use client";

import { useEffect, useState } from "react";
import { formatCurrency, getUserCountry } from "../utils/lib";
import { useCartQuery } from "../hooks/query/useCart";
import { cn } from "../utils/cn";

export const OrderSummary = ({ alignToEnd, state }) => {
  const [userCurrency, setUserCurrency] = useState();
  const [deliveryFee, setDeliveryFee] = useState(0);

  const { status, data } = useCartQuery();
  console.log(data)
  useEffect(() => {
    setUserCurrency(getUserCountry());
  }, []);

  useEffect(() => {
    if (data) {
      const fee =
        data.subTotal > 100_000
          ? 0
          : state && state === "lagos"
          ? 2500
          : 5000;
      setDeliveryFee(fee);
    }
  }, [data, state]);

  return (
    <>
      {status === "pending" ? (
        "Loading ..."
      ) : !data?.items || data.items.length === 0 ? null : (
        <div className="font-medium pt-6 md:p-0">
          <div
            className={cn(
              `flex items-center justify-between py-1`,
              alignToEnd ? "md:justify-end gap-3" : ""
            )}
          >
            <h2 className="font-normal">Subtotal:</h2>
            <p className="font-normal">{formatCurrency(data.subTotal, userCurrency)}</p>
          </div>
          <div
            className={cn(
              `flex items-center justify-between py-1 font-normal`,
              alignToEnd ? "md:justify-end gap-3" : ""
            )}
          >
            <h2 className="font-light">Discount:</h2>
            <p className="font-light">{formatCurrency(data?.discount || "", userCurrency)}</p>
          </div>
          <div
            className={cn(
              `flex items-center justify-between py-1 fon`,
              alignToEnd ? "md:justify-end gap-3" : ""
            )}
          >
            <h2 className="text-blue-400 font-normal">Delivery Fee:</h2>
            <p>{formatCurrency(deliveryFee, userCurrency)}</p>
          </div>
          <div
            className={cn(
              `flex items-center justify-between py-1 text-app-red font-normal`,
              alignToEnd ? "md:justify-end gap-3" : ""
            )}
          >
            <h2 className="font-normal">7.5% VAT Inclusive</h2>
          </div>
          <div
            className={cn(
              "flex items-center justify-between pb-1 pt-2 font-normal",
              alignToEnd ? "md:justify-end gap-3" : ""
            )}
          >
            <h2 className="font-normal">Total:</h2>
            <p className="font-normal">
              {formatCurrency(
                data.subTotal - (data?.discount ?? 0) + deliveryFee,
                userCurrency
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export const CouponCode = () => {
  return (
    <div className="bg-red-100 rounded-full overflow-hidden relative max-w-lg md:w-[480px]">
      <input
        type="text"
        className="py-2 w-full pl-4 pr-32 outline-none"
        placeholder="Enter Discount Code"
      />
      <button className="bg-app-black absolute right-0 top-0 bottom-0 w-28 text-white">
        Apply
      </button>
    </div>
  );
};
