"use client";

import { useAuth } from "../hooks/utils/useAuth";
import Link from "next/link";

/**
 * User display component - shows account link or user info.
 * Auth state is read from AuthContext.
 */
const User = () => {
  const { user } = useAuth();
  return (
    <Link href="/account" aria-label="Account">
      {user?.email || "Account"}
    </Link>
  );
};

export default User;
