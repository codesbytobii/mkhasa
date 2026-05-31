"use client";

import dynamic from "next/dynamic";

const AdminLoginComponent = dynamic(
  () => import("@/app-pages/admin/login").then((mod) => mod.default),
  { ssr: false }
);

export default function AdminLoginClient() {
  return <AdminLoginComponent />;
}
