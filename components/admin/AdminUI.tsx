import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Shared presentational pieces for the admin dashboard.
 * Server-safe (no hooks), so they can be used from server and client components.
 */

/** Standard form control styling for admin inputs, selects and textareas. */
export const adminInputClass =
  "w-full h-9 rounded-md border border-border-glass bg-bg-primary px-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors hover:border-border-glass-hover focus-visible:border-accent-blue focus-visible:ring-2 focus-visible:ring-accent-blue/20 disabled:opacity-60";

export const adminTextareaClass =
  "w-full min-h-[96px] rounded-md border border-border-glass bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors hover:border-border-glass-hover focus-visible:border-accent-blue focus-visible:ring-2 focus-visible:ring-accent-blue/20 disabled:opacity-60";

export const adminLabelClass = "block text-xs font-medium text-text-secondary mb-1.5";

/** Table cell classes, so every admin table looks the same. */
export const adminTable = {
  wrapper: "overflow-x-auto",
  table: "w-full text-sm text-left border-collapse",
  th: "px-4 py-2.5 text-xs font-medium text-text-muted border-b border-border-glass whitespace-nowrap",
  tr: "border-b border-border-glass last:border-b-0 transition-colors hover:bg-text-primary/[0.025]",
  td: "px-4 py-3 align-middle",
};

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">{title}</h1>
        {description && <p className="mt-1 text-sm text-text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  href?: string;
}) {
  const body = (
    <>
      <div className="text-xs font-medium text-text-muted">{label}</div>
      <div className="mt-1.5 text-2xl font-semibold tracking-tight text-text-primary tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-text-muted">{hint}</div>}
    </>
  );
  const className = "block rounded-xl border border-border-glass bg-bg-card p-4";
  return href ? (
    <Link href={href} className={cn(className, "transition-colors hover:border-border-glass-hover")}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  description?: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-border-glass bg-bg-card", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-border-glass">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold text-text-primary">{title}</h2>}
            {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
          </div>
          {action && (
            <Link
              href={action.href}
              className="inline-flex items-center gap-0.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors shrink-0"
            >
              {action.label}
              <ChevronRight size={14} />
            </Link>
          )}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

const statusStyles = {
  published: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", label: "Published" },
  draft: { dot: "bg-text-muted", text: "text-text-muted", label: "Draft" },
  visible: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", label: "Visible" },
  hidden: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", label: "Hidden" },
  ok: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", label: "OK" },
  warning: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", label: "Warning" },
  error: { dot: "bg-red-500", text: "text-red-600 dark:text-red-400", label: "Error" },
} as const;

export function StatusBadge({ status, label }: { status: keyof typeof statusStyles; label?: string }) {
  const style = statusStyles[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap", style.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} aria-hidden="true" />
      {label ?? style.label}
    </span>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      {Icon && <Icon size={28} className="mb-3 text-text-muted" />}
      <p className="text-sm font-medium text-text-primary">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** Segmented control for small sets of filters (e.g. All / Published / Drafts). */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex items-center rounded-md border border-border-glass bg-bg-primary p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={cn(
            "h-7 px-3 rounded text-xs font-medium transition-colors",
            value === opt.value
              ? "bg-bg-card text-text-primary shadow-sm"
              : "text-text-muted hover:text-text-primary"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
