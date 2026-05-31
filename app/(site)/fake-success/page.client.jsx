"use client";

import dynamic from "next/dynamic";

const FakeSuccessComponent = dynamic(
  () => import("@/app-pages/fake-success").then((mod) => mod.Component),
  { ssr: false }
);

export default function FakeSuccessClient() {
  return <FakeSuccessComponent />;
}
