"use client";

import { useAuth } from "../hooks/utils/useAuth";
import { Wrapper } from "../components/ui/Wrapper";
import { Cart } from "../components/Cart";
import { GuestCart } from "../components/GuestCart";
import { OrderTotal } from "../components/OrderTotal";
import Link from "next/link";
import LoadingSpinner from "../components/LoadingSpinner";

export const Component = () => {
  const { user, authReady } = useAuth();
  console.log({ user, authReady });

  // Wait for localStorage hydration before deciding which cart to show
  if (!authReady) return <LoadingSpinner />;

  return (
    <Wrapper className="py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <Link
          href="/all-products"
          className="text-sm underline hover:text-app-red transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      {user ? <Cart /> : <GuestCart />}

      <OrderTotal Partial />
    </Wrapper>
  );
};
