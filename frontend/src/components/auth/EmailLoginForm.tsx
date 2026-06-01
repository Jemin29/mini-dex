"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type EmailLoginFormProps = {
  callbackUrl?: string;
  mode?: "login" | "register";
};

export default function EmailLoginForm({ callbackUrl, mode = "login" }: EmailLoginFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const result = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: callbackUrl || "/dashboard"
    });

    if (result?.error) {
      setMessage("Unable to send login link. Check your email settings.");
    } else {
      setMessage(
        mode === "register"
          ? "Check your inbox to confirm your account."
          : "Check your inbox for the secure login link."
      );
    }

    setIsLoading(false);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <Input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? "Sending..." : mode === "register" ? "Send sign-up link" : "Send login link"}
      </Button>
      {message && <p className="text-xs text-muted">{message}</p>}
    </form>
  );
}
