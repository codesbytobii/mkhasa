"use client";

import dynamic from "next/dynamic";

const CheckoutComponent = dynamic(
  () => import("@/app-pages/checkout").then((mod) => mod.Component),
  { ssr: false }
);

export default function CheckoutClient() {
  return <CheckoutComponent />;
}