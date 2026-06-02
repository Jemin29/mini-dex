"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useSession } from "next-auth/react";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import WalletLoginButton from "@/components/auth/WalletLoginButton";
import EmailLoginForm from "@/components/auth/EmailLoginForm";
import OAuthButtons from "@/components/auth/OAuthButtons";

function RegisterContent() {
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
        eyebrow="Get started"
        title="Create your account"
        subtitle="Use wallet-based access or a secure email magic link."
      />
      <Card className="max-w-xl">
        <CardContent className="space-y-6">
          <WalletLoginButton callbackUrl={callbackUrl} />
          <OAuthButtons callbackUrl={callbackUrl} />
          {emailEnabled && <EmailLoginForm callbackUrl={callbackUrl} mode="register" />}
          <p className="text-xs text-muted">
            Already have access?{" "}
            <Link href="/login" className="text-foreground hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-64" />}>
      <RegisterContent />
    </Suspense>
  );
}
