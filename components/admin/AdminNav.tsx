"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  FileText,
  MessageSquare,
  Briefcase,
  Settings,
  ExternalLink,
  Menu,
} from "lucide-react";
import { getAdminSidebarMetrics } from "@/app/admin/actions";
import { ADMIN_DATA_CHANGED } from "@/components/admin/run-action";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type Metrics = { hiddenComments: number; draftPosts: number; draftJobs: number };

const MetricsContext = createContext<Metrics>({ hiddenComments: 0, draftPosts: 0, draftJobs: 0 });

/**
 * Loads the sidebar counts and shares them with every nav instance.
 * Reloads on navigation and after any successful admin action (runAction fires ADMIN_DATA_CHANGED).
 */
export function AdminMetricsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [metrics, setMetrics] = useState<Metrics>({ hiddenComments: 0, draftPosts: 0, draftJobs: 0 });

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      getAdminSidebarMetrics()
        .then((m) => !cancelled && setMetrics(m))
        .catch(() => {});
    };
    load();
    window.addEventListener(ADMIN_DATA_CHANGED, load);
    return () => {
      cancelled = true;
      window.removeEventListener(ADMIN_DATA_CHANGED, load);
    };
  }, [pathname]);

  return <MetricsContext.Provider value={metrics}>{children}</MetricsContext.Provider>;
}

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact?: boolean;
  count?: (m: Metrics) => number;
  countLabel?: string;
};

const NAV: { section?: string; items: NavItem[] }[] = [
  {
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    section: "Content",
    items: [
      { href: "/admin/posts", label: "Posts", icon: FileText, count: (m) => m.draftPosts, countLabel: "drafts" },
      { href: "/admin/comments", label: "Comments", icon: MessageSquare, count: (m) => m.hiddenComments, countLabel: "hidden" },
      { href: "/admin/jobs", label: "Jobs", icon: Briefcase, count: (m) => m.draftJobs, countLabel: "drafts" },
    ],
  },
  {
    section: "Community",
    items: [{ href: "/admin/developers", label: "Developers & TIDs", icon: Users }],
  },
  {
    section: "System",
    items: [{ href: "/admin/settings", label: "Settings", icon: Settings }],
  },
];

function isActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  // The post editor lives under /admin/editor but belongs to Posts
  if (item.href === "/admin/posts" && pathname.startsWith("/admin/editor")) return true;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const metrics = useContext(MetricsContext);

  return (
    <nav className="flex flex-col gap-5" aria-label="Admin">
      {NAV.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-0.5">
          {group.section && (
            <div className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-text-muted">
              {group.section}
            </div>
          )}
          {group.items.map((item) => {
            const active = isActive(pathname, item);
            const count = item.count?.(metrics) ?? 0;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-9 items-center gap-2.5 rounded-md px-3 text-sm transition-colors",
                  active
                    ? "bg-text-primary/[0.07] font-medium text-text-primary"
                    : "text-text-secondary hover:bg-text-primary/[0.04] hover:text-text-primary"
                )}
              >
                <Icon size={16} className={active ? "text-accent-blue-light" : "text-text-muted"} />
                <span className="flex-1 truncate">{item.label}</span>
                {count > 0 && (
                  <span className="text-xs tabular-nums text-text-muted" title={`${count} ${item.countLabel}`}>
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-2.5 px-3">
      <Image src="/logo.png" alt="Techfamz logo" width={28} height={28} className="rounded-full shrink-0" />
      <span className="text-[15px] font-bold tracking-tight text-text-primary">
        Techfamz <span className="font-medium text-text-muted">Admin</span>
      </span>
    </Link>
  );
}

function ViewSiteLink() {
  return (
    <a
      href="/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 items-center gap-2.5 rounded-md px-3 text-sm text-text-secondary transition-colors hover:bg-text-primary/[0.04] hover:text-text-primary"
    >
      <ExternalLink size={16} className="text-text-muted" />
      View live site
    </a>
  );
}

/** Desktop sidebar contents (the <aside> wrapper lives in the layout). */
export function AdminSidebar({ footer }: { footer: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-border-glass px-2">
        <Brand />
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-4">
        <NavLinks />
      </div>
      <div className="border-t border-border-glass px-2 py-3">
        <ViewSiteLink />
        {footer}
      </div>
    </div>
  );
}

/** Mobile menu: a slide-in sheet with the same navigation. */
export function AdminMobileNav({ footer }: { footer: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-text-secondary hover:bg-text-primary/[0.05] hover:text-text-primary"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 bg-bg-secondary border-border-glass">
        <SheetTitle className="sr-only">Admin menu</SheetTitle>
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b border-border-glass px-2">
            <Brand />
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-4">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
          <div className="border-t border-border-glass px-2 py-3">
            <ViewSiteLink />
            {footer}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
