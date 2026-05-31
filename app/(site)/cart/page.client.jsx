"use client";

import dynamic from "next/dynamic";

const CartComponent = dynamic(
  () => import("@/app-pages/cart").then((mod) => mod.Component),
  { ssr: false }
);

export default function CartPageClient() {
  return <CartComponent />;
}
