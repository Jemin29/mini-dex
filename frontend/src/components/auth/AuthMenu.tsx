"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/useMounted";
import { User, LogOut } from "lucide-react";

export default function AuthMenu() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, signOut } = useAuth();
  const mounted = useMounted();

  if (!mounted) return null;

  if (isLoading) {
    return (
      <Button size="sm" variant="ghost" disabled className="animate-pulse">
        <User className="h-4 w-4" />
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button size="sm" variant="outline" asChild>
        <Link href="/login">Sign in</Link>
      </Button>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Account";

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="ghost" asChild>
        <Link href="/dashboard" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{displayName}</span>
        </Link>
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleSignOut}
        title="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
