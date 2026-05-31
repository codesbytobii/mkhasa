"use client";

import dynamic from "next/dynamic";
import { GuestGuard } from "@/components/AuthGuard";

const LoginComponent = dynamic(
  () => import("@/app-pages/login").then((mod) => mod.Component),
  { ssr: false }
);

export default function LoginPage() {
  return (
    <GuestGuard>
      <LoginComponent />
    </GuestGuard>
  );
}
