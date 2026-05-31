"use client";

import dynamic from "next/dynamic";
import { AuthGuard } from "@/components/AuthGuard";

const ProfileComponent = dynamic(
  () => import("@/app-pages/profile").then((mod) => mod.Component),
  { ssr: false }
);

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileComponent />
    </AuthGuard>
  );
}
