"use client";

import dynamic from "next/dynamic";
import { AuthGuard } from "@/components/AuthGuard";

const AccountComponent = dynamic(
  () => import("@/app-pages/account").then((mod) => mod.Component),
  { ssr: false }
);

export default function AccountPage() {
  return (
    <AuthGuard>
      <AccountComponent />
    </AuthGuard>
  );
}
