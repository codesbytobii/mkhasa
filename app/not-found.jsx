"use client";

import dynamic from "next/dynamic";

const PageNotFound = dynamic(() => import("@/components/commons/PageNotFound"), {
  ssr: false,
});

export default function NotFound() {
  return <PageNotFound />;
}
