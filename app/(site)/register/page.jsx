"use client";

import dynamic from "next/dynamic";
import { GuestGuard } from "@/components/AuthGuard";

const RegisterComponent = dynamic(
  () => import("@/app-pages/register").then((mod) => mod.Component),
  { ssr: false }
);

export default function RegisterPage() {
  return (
    <GuestGuard>
      <RegisterComponent />
    </GuestGuard>
  );
}
