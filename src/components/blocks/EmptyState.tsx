import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { EmptyArt, type EmptyArtKind } from "./EmptyArt";

export type EmptyStateProps = {
  /** A small cover-style picture; preferred over `icon` */
  art?: EmptyArtKind;
  icon?: LucideIcon;
  title: string;
  body?: string;
  /** Usually one Button that resolves the empty state */
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ art, icon: Icon, title, body, action, className }: EmptyStateProps) {
  return (
    <div
      data-enter
      className={cn(
        "flex flex-col items-center gap-3 rounded-card border border-dashed border-rule-strong px-6 py-12 sm:py-16 text-center",
        className,
      )}
    >
      {art ? (
        <div className="mb-2">
          <EmptyArt kind={art} />
        </div>
      ) : (
        Icon && <Icon aria-hidden className="size-6 text-muted" />
      )}
      <p className="text-body font-medium">{title}</p>
      {body && <p className="max-w-[40ch] text-small text-muted">{body}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
