"use client";

import dynamic from "next/dynamic";
import { AuthGuard } from "@/components/AuthGuard";

const CheckoutComponent = dynamic(
  () => import("@/app-pages/checkout").then((mod) => mod.Component),
  { ssr: false }
);

export default function CheckoutPage() {
  return (
    // <AuthGuard>
      <CheckoutComponent />
    // </AuthGuard>
  );
}


