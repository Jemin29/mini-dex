"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import WalletLoginButton from "@/components/auth/WalletLoginButton";
import EmailLoginForm from "@/components/auth/EmailLoginForm";
import OAuthButtons from "@/components/auth/OAuthButtons";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("from") || "/dashboard";
  const emailEnabled = process.env.NEXT_PUBLIC_AUTH_EMAIL_ENABLED === "true";

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [callbackUrl, router, status]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Authentication"
        title="Welcome back"
        subtitle="Sign in with your wallet or preferred identity provider."
      />
      <Card className="max-w-xl">
        <CardContent className="space-y-6">
          <WalletLoginButton callbackUrl={callbackUrl} />
          <OAuthButtons callbackUrl={callbackUrl} />
          {emailEnabled && <EmailLoginForm callbackUrl={callbackUrl} />}
          <p className="text-xs text-muted">
            New here?{" "}
            <Link href="/register" className="text-foreground hover:underline">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
