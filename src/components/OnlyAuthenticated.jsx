"use client";

import { useAuth } from "../hooks/utils/useAuth";
import { usePathname, useSearchParams, redirect } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Wraps children and redirects unauthenticated users to /login.
 * Use inside a page component or layout that requires auth.
 */
const OnlyAuthenticated = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user?.token) {
      const redirect = encodeURIComponent(pathname);
      router.replace(`/login?redirect=${redirect}`);
    }
  }, [user, pathname, router]);

  if (!user?.token) return null;
  return children;
};

export default OnlyAuthenticated;
