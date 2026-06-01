"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/useMounted";

export default function AuthMenu() {
  const { data: session, status } = useSession();
  const mounted = useMounted();

  if (!mounted) return null;

  if (status === "loading") {
    return (
      <Button size="sm" variant="ghost" disabled>
        Checking session...
      </Button>
    );
  }

  if (!session) {
    return (
      <Button size="sm" variant="outline" asChild>
        <Link href="/login">Sign in</Link>
      </Button>
    );
  }

  const label = session.user?.name || session.user?.email || session.user?.address || "Account";

  return (
    <Button
      size="sm"
      variant="ghost"
      title={label}
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Logout
    </Button>
  );
}
