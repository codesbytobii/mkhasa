"use client";

import dynamic from "next/dynamic";

const ConfirmOtpComponent = dynamic(
  () => import("@/app-pages/confirm-otp").then((mod) => mod.Component),
  { ssr: false }
);

export default function ConfirmOtpClient() {
  return <ConfirmOtpComponent />;
}
