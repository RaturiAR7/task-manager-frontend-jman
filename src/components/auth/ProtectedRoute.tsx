"use client";

import { useAuth } from "@/src/context/authContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: ("ADMIN" | "MANAGER" | "EMPLOYEE")[];
}) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!user) {
      // Not logged in, redirect to login unless already there
      if (pathname !== "/auth" && pathname !== "/login") {
        router.push("/auth");
      }
      return;
    }

    // Role-based guarding
    if (allowedRoles && !allowedRoles.includes(user.role as any)) {
      // User is logged in but doesn't have the required role
      if (user.role === "EMPLOYEE") {
        router.push("/account");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, allowedRoles, router, pathname, mounted]);

  if (!mounted) return null; // Avoid hydration mismatch

  // Show nothing if checking auth
  if (!user && pathname !== "/auth" && pathname !== "/login") {
    return null;
  }

  // Show nothing if unauthorized
  if (user && allowedRoles && !allowedRoles.includes(user.role as any)) {
    return null;
  }

  return <>{children}</>;
}
