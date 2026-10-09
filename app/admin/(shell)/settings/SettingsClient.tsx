"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle, ExternalLink, Eye, EyeOff, RefreshCw } from "lucide-react";
import { updateAdminPassword } from "@/app/admin/actions";
import type { getSystemHealth } from "@/app/admin/actions";
import { PageHeader, Panel, adminInputClass, adminLabelClass } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SystemHealthData = Awaited<ReturnType<typeof getSystemHealth>>;
type ServiceKey = keyof SystemHealthData["services"];
type Tone = "ok" | "warn" | "error";

interface SettingsClientProps {
  userEmail: string;
  initialHealth: SystemHealthData;
}

const MIN_PASSWORD_LENGTH = 8;
const NETWORK_ERROR = "Something went wrong. Check your connection and try again.";

/** What each integration is used for; "configured" only means its environment variables are set. */
const SERVICES: {
  key: ServiceKey;
  name: string;
  purpose: string;
  env: string[];
  /** How serious a missing configuration is. */
  missingTone: Tone;
}[] = [
  {
    key: "nextAuth",
    name: "NextAuth",
    purpose: "Signs admin session tokens",
    env: ["NEXTAUTH_SECRET"],
    missingTone: "error",
  },
  {
    key: "resend",
    name: "Resend",
    purpose: "Sends the TID welcome email",
    env: ["RESEND_API_KEY"],
    missingTone: "warn",
  },
  {
    key: "cloudinary",
    name: "Cloudinary",
    purpose: "Image uploads in the post editor",
    env: ["CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET", "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"],
    missingTone: "warn",
  },
  {
    key: "gemini",
    name: "Google Gemini",
    purpose: "AI excerpt suggestions in the post editor",
    env: ["GEMINI_API_KEY"],
    missingTone: "warn",
  },
];

const PUBLIC_PAGES = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Jobs", href: "/jobs" },
  { label: "TID overview", href: "/identity" },
  { label: "Claim a TID", href: "/identity/claim" },
];

const toneStyles: Record<Tone, { dot: string; text: string }> = {
  ok: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  warn: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  error: { dot: "bg-red-500", text: "text-red-600 dark:text-red-400" },
};

/** Same look as StatusBadge in AdminUI, with an error tone for system checks. */
function HealthStatus({ tone, label }: { tone: Tone; label: string }) {
  const style = toneStyles[tone];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap", style.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} aria-hidden="true" />
      {label}
    </span>
  );
}

export default function SettingsClient({ userEmail, initialHealth }: SettingsClientProps) {
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();
  const health = initialHealth;
  const dbOk = health.database.status === "connected";

  const counts: { label: string; value: number }[] = [
    { label: "Posts", value: health.counts.posts },
    { label: "Jobs", value: health.counts.jobs },
    { label: "TID holders", value: health.counts.developers },
    { label: "Comments", value: health.counts.comments },
    { label: "Admin users", value: health.counts.users },
  ];

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Your admin account, and the services this site depends on."
        actions={
          <Button
            variant="outline"
            size="xs"
            onClick={() => startRefresh(() => router.refresh())}
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={cn(isRefreshing && "animate-spin")} />
            {isRefreshing ? "Checking…" : "Re-check health"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-6">
          <Panel title="Account" description="Change the password you use to sign in.">
            <div className="flex items-center gap-3 border-b border-border-glass px-4 py-3">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-blue-glow-soft text-sm font-semibold text-accent-blue-light"
                aria-hidden="true"
              >
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text-primary" title={userEmail}>
                  {userEmail}
                </p>
                <p className="text-xs text-text-muted">Administrator · signed in</p>
              </div>
            </div>
            <PasswordForm userEmail={userEmail} />
          </Panel>

          <Panel title="Public pages" description="Open the live site in a new tab.">
            <ul className="divide-y divide-border-glass">
              {PUBLIC_PAGES.map((page) => (
                <li key={page.href}>
                  <a
                    href={page.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-text-primary/2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-blue/40"
                  >
                    <span className="flex-1 text-text-primary">{page.label}</span>
                    <span className="font-mono text-xs text-text-muted">{page.href}</span>
                    <ExternalLink size={14} className="shrink-0 text-text-muted" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Panel
            title="System health"
            description="Checked when this page loaded. “Configured” means the environment variables are set; the keys are not tested."
          >
            <ul className="divide-y divide-border-glass">
              <li className="flex items-start gap-4 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary">Database</p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    Neon Postgres
                    {dbOk && (
                      <>
                        {" · "}
                        <span className="tabular-nums">{health.database.latencyMs} ms</span> query round trip
                      </>
                    )}
                  </p>
                  {!dbOk && health.database.error && (
                    <p className="mt-1 wrap-break-word text-xs text-red-600 dark:text-red-400">{health.database.error}</p>
                  )}
                </div>
                <HealthStatus tone={dbOk ? "ok" : "error"} label={dbOk ? "Connected" : "Unreachable"} />
              </li>

              {SERVICES.map((service) => {
                const configured = health.services[service.key].configured;
                return (
                  <li key={service.key} className="flex items-start gap-4 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary">{service.name}</p>
                      <p className="mt-0.5 text-xs text-text-muted">{service.purpose}</p>
                      <p className="mt-1 break-all font-mono text-[11px] text-text-muted">
                        {service.env.join(", ")}
                      </p>
                    </div>
                    <HealthStatus
                      tone={configured ? "ok" : service.missingTone}
                      label={configured ? "Configured" : "Not configured"}
                    />
                  </li>
                );
              })}

              <li className="flex items-center gap-4 px-4 py-3">
                <p className="flex-1 text-sm font-medium text-text-primary">Environment</p>
                <span className="font-mono text-xs text-text-secondary">{health.environment}</span>
              </li>
            </ul>
          </Panel>

          <Panel title="Records" description="Rows in the database.">
            <dl className="divide-y divide-border-glass">
              {counts.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 px-4 py-2.5">
                  <dt className="text-sm text-text-secondary">{item.label}</dt>
                  <dd className="text-sm font-medium tabular-nums text-text-primary">
                    {item.value.toLocaleString("en-US")}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ─── Change password ───

function PasswordForm({ userEmail }: { userEmail: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setError("");

    if (!currentPassword) {
      setError("Enter your current password.");
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`The new password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("The new passwords don't match.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("The new password must be different from the current one.");
      return;
    }

    setSaving(true);
    try {
      const result = await updateAdminPassword({ currentPassword, newPassword });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrent(false);
      setShowNew(false);
      toast.success("Password updated");
    } catch (err) {
      console.error(err);
      setError(NETWORK_ERROR);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm space-y-4 p-4">
      {/* Lets password managers link the new password to this account. */}
      <input type="email" name="username" autoComplete="username" value={userEmail} readOnly hidden />

      <div>
        <label htmlFor="current-password" className={adminLabelClass}>
          Current password
        </label>
        <PasswordInput
          id="current-password"
          value={currentPassword}
          onChange={setCurrentPassword}
          autoComplete="current-password"
          visible={showCurrent}
          onToggleVisible={() => setShowCurrent((v) => !v)}
          disabled={saving}
        />
      </div>

      <div>
        <label htmlFor="new-password" className={adminLabelClass}>
          New password
        </label>
        <PasswordInput
          id="new-password"
          value={newPassword}
          onChange={setNewPassword}
          autoComplete="new-password"
          visible={showNew}
          onToggleVisible={() => setShowNew((v) => !v)}
          disabled={saving}
          describedBy="new-password-hint"
        />
        <p id="new-password-hint" className="mt-1.5 text-xs text-text-muted">
          At least {MIN_PASSWORD_LENGTH} characters.
        </p>
      </div>

      <div>
        <label htmlFor="confirm-password" className={adminLabelClass}>
          Confirm new password
        </label>
        <input
          id="confirm-password"
          type={showNew ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          disabled={saving}
          aria-invalid={mismatch || undefined}
          aria-describedby={mismatch ? "confirm-password-error" : undefined}
          className={cn(adminInputClass, mismatch && "border-red-500/60")}
        />
        {mismatch && (
          <p id="confirm-password-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            Doesn&apos;t match the new password.
          </p>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="xs" disabled={saving}>
          {saving ? "Updating…" : "Update password"}
        </Button>
        <p className="text-xs text-text-muted">Other devices stay signed in.</p>
      </div>
    </form>
  );
}

function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  visible,
  onToggleVisible,
  disabled,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  visible: boolean;
  onToggleVisible: () => void;
  disabled: boolean;
  describedBy?: string;
}) {
  const label = visible ? "Hide password" : "Show password";
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-describedby={describedBy}
        className={cn(adminInputClass, "pr-10")}
      />
      <button
        type="button"
        onClick={onToggleVisible}
        aria-label={label}
        aria-pressed={visible}
        title={label}
        className="absolute right-1.5 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded text-text-muted transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/40"
      >
        {visible ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}
