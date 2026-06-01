import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title="Account overview"
        subtitle="Private session data, recent activity, and preferences live here."
      />
      <Card className="max-w-2xl">
        <CardContent className="space-y-2 text-sm text-muted">
          <p className="text-foreground">Authenticated session active.</p>
          <p>Wallet address: {session?.user?.address || "Not available"}</p>
          <p>Identity: {session?.user?.email || session?.user?.name || "Wallet"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
