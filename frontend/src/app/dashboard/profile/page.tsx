"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Wallet, FileText, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Profile = {
  id: string;
  display_name: string | null;
  bio: string | null;
  wallet_address: string | null;
  avatar_url: string | null;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  
  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setDisplayName(profileData.display_name || "");
        setBio(profileData.bio || "");
        setWalletAddress(profileData.wallet_address || "");
      }
      
      setIsLoading(false);
    };

    loadProfile();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError("Not authenticated");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName || null,
          bio: bio || null,
          wallet_address: walletAddress || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <PageHeader
        eyebrow="Settings"
        title="Edit Profile"
        subtitle="Update your display name, bio, and linked wallet address."
      />
      
      <Card className="max-w-xl">
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  placeholder="Your display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <div className="relative">
                <FileText className="absolute left-4 top-3 h-4 w-4 text-muted" />
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-[100px] w-full rounded-md border border-border bg-transparent px-4 py-3 pl-11 text-base text-foreground placeholder:text-muted transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="walletAddress">Wallet Address</Label>
              <div className="relative">
                <Wallet className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input
                  id="walletAddress"
                  name="walletAddress"
                  type="text"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="pl-11 font-mono text-sm"
                />
              </div>
              <p className="text-xs text-muted">
                Link your Ethereum wallet address to your profile.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 p-3 text-sm text-accent">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                Profile updated successfully!
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
