"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

type OAuthButtonsProps = {
  callbackUrl?: string;
};

export default function OAuthButtons({ callbackUrl }: OAuthButtonsProps) {
  const isGoogleEnabled = process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true";

  if (!isGoogleEnabled) return null;

  return (
    <Button
      className="w-full"
      variant="outline"
      onClick={() => signIn("google", { callbackUrl: callbackUrl || "/dashboard" })}
    >
      Continue with Google
    </Button>
  );
}
