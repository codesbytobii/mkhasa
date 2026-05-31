"use client";

import { useAuth } from "../hooks/utils/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Wraps pages that require authentication.
 * Waits for authReady (localStorage hydration) before deciding to redirect,
 * so logged-in users never get flashed to the login page.
 */
export const AuthGuard = ({ children }) => {
  const { user, authReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authReady && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [authReady, user, pathname, router]);

  // Still hydrating — show spinner, don't redirect yet
  if (!authReady) return <LoadingSpinner />;

  // Hydrated but no user — spinner while redirect happens
  if (!user) return <LoadingSpinner />;

  return children;
};

/**
 * Wraps pages only visible to guests (login, register, forgot-password).
 * Redirects logged-in users to /account once hydration is complete.
 */
export const GuestGuard = ({ children }) => {
  const { user, authReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authReady && user?.token) {
      router.replace("/account");
    }
  }, [authReady, user, router]);

  // Hydrating or about to redirect — show spinner
  if (!authReady || user?.token) return <LoadingSpinner />;

  return children;
};
