"use client";

import dynamic from "next/dynamic";

const ResetPasswordComponent = dynamic(
  () => import("@/app-pages/forgot-password").then((mod) => mod.ResetPassword),
  { ssr: false }
);

export default function ResetPasswordClient() {
  return <ResetPasswordComponent />;
}
