"use client";

import dynamic from "next/dynamic";
import { AuthGuard } from "@/components/AuthGuard";

const OrderHistoryComponent = dynamic(
  () => import("@/app-pages/order-history").then((mod) => mod.Component),
  { ssr: false }
);

export default function OrderHistoryPage() {
  return (
    <AuthGuard>
      <OrderHistoryComponent />
    </AuthGuard>
  );
}
