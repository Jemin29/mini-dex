import Link from "next/link";
import { Button } from "@/components/ui/button";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export default function PageHeader({ eyebrow, title, subtitle, ctaHref, ctaLabel }: PageHeaderProps) {
  return (
    <div className="space-y-4 animate-fade-up">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">{eyebrow}</p>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">{title}</h1>
          <p className="max-w-2xl text-sm text-muted md:text-base">{subtitle}</p>
        </div>
        {ctaHref && ctaLabel && (
          <Button asChild size="lg">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
