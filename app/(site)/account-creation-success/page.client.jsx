"use client";

import dynamic from "next/dynamic";

const SuccessComponent = dynamic(
  () => import("@/app-pages/success").then((mod) => mod.Component),
  { ssr: false }
);

export default function AccountCreationSuccessClient() {
  return <SuccessComponent />;
}
