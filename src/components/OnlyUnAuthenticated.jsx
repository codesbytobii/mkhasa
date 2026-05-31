"use client";

import { useAuth } from "../hooks/utils/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Wraps children and redirects already-authenticated users to /.
 * Use on login/register pages.
 */
const OnlyUnAuthenticated = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.token) {
      router.replace("/");
    }
  }, [user, router]);

  if (user?.token) return null;
  return children;
};

export default OnlyUnAuthenticated;
