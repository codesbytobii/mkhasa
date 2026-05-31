"use client";

import dynamic from "next/dynamic";
import { HomeLoaderProvider } from "@/legacy/loaders-client";

const CheckoutSuccessComponent = dynamic(
  () => import("@/app-pages/checkout-success").then((mod) => mod.Component),
  { ssr: false }
);

export default function PaymentCallbackClient() {
  return (
    <HomeLoaderProvider>
      <CheckoutSuccessComponent />
    </HomeLoaderProvider>
  );
}
