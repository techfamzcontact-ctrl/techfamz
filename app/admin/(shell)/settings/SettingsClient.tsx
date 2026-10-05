"use client";

import { useState, useTransition } from "react";
import { updateAdminPassword } from "@/app/admin/actions";
import {
  ShieldCheck,
  KeyRound,
  Server,
  Database,
  Mail,
  Image as ImageIcon,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
  User,
  Globe,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SystemHealthData {
  database: {
    status: "connected" | "error";
    latencyMs: number;
    error: string | null;
  };
  services: {
    resend: { configured: boolean };
    cloudinary: { configured: boolean };
    gemini: { configured: boolean };
    nextAuth: { configured: boolean };
  };
  counts: {
    users: number;
    posts: number;
    jobs: number;
    developers: number;
    comments: number;
  };
  environment: string;
}

interface SettingsClientProps {
  userEmail: string;
  initialHealth: SystemHealthData;
}

export default function SettingsClient({
  userEmail,
  initialHealth,
}: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<"security" | "health" | "info">("security");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");

    if (!currentPassword) {
      setPassError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setPassError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError("New passwords do not match.");
      return;
    }

    startTransition(async () => {
      try {
        await updateAdminPassword({ currentPassword, newPassword });
        setPassSuccess("Password updated successfully! Keep your new credentials secure.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (err) {
        setPassError(err instanceof Error ? err.message : "Failed to update password.");
      }
    });
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Settings & Operations
        </h1>
        <p className="text-sm text-text-muted">
          Manage admin credentials, security preferences, and inspect platform infrastructure.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-border-glass pb-2">
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "security"
              ? "bg-accent-blue/15 text-accent-blue-light border border-accent-blue-glow/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
              : "text-text-muted hover:text-text-primary hover:bg-bg-card"
          }`}
        >
          <KeyRound size={16} />
          <span>Security & Account</span>
        </button>

        <button
          onClick={() => setActiveTab("health")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "health"
              ? "bg-accent-blue/15 text-accent-blue-light border border-accent-blue-glow/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
              : "text-text-muted hover:text-text-primary hover:bg-bg-card"
          }`}
        >
          <Server size={16} />
          <span>System & Integrations</span>
        </button>

        <button
          onClick={() => setActiveTab("info")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "info"
              ? "bg-accent-blue/15 text-accent-blue-light border border-accent-blue-glow/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
              : "text-text-muted hover:text-text-primary hover:bg-bg-card"
          }`}
        >
          <Globe size={16} />
          <span>Ecosystem Info</span>
        </button>
      </div>

      {/* TAB 1: SECURITY & ACCOUNT */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Current Profile Card */}
          <div className="bg-bg-card border border-border-glass rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-text-primary mb-1 flex items-center gap-2">
              <User size={16} className="text-accent-blue-light" />
              <span>Active Administrator</span>
            </h3>
            <p className="text-xs text-text-muted mb-4">
              Currently signed in session details.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg bg-bg-primary/50 border border-border-glass gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-blue/10 border border-accent-blue-glow/30 flex items-center justify-center font-bold text-accent-blue-light text-sm">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">
                    {userEmail}
                  </div>
                  <div className="text-xs text-text-muted">
                    Full Admin Privileges · JWT Session
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 self-start sm:self-center">
                <CheckCircle2 size={13} /> Active Session
              </span>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="bg-bg-card border border-border-glass rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Lock size={16} className="text-accent-blue-light" />
              <h3 className="text-sm font-bold text-text-primary">
                Update Admin Password
              </h3>
            </div>
            <p className="text-xs text-text-muted mb-6">
              Ensure your account is protected with a strong, unique password (minimum 8 characters).
            </p>

            {passError && (
              <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            {passSuccess && (
              <div className="mb-5 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0" />
                <span>{passSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
              <div>
                <Label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    type={showCurrentPass ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter current password"
                    className="bg-bg-primary border-border-glass pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                  >
                    {showCurrentPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="At least 8 characters"
                    className="bg-bg-primary border-border-glass pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                  >
                    {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">
                  Confirm New Password
                </Label>
                <Input
                  type={showNewPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter new password"
                  className="bg-bg-primary border-border-glass text-sm"
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="mt-2 bg-accent-blue text-white hover:bg-blue-600 shadow-[0_0_15px_var(--color-accent-blue-glow-soft)]"
              >
                {isPending ? "Updating Password..." : "Save New Password"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEM HEALTH & INTEGRATIONS */}
      {activeTab === "health" && (
        <div className="space-y-6">
          {/* Database Health Card */}
          <div className="bg-bg-card border border-border-glass rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3.5 border-b border-border-glass mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent-blue/10 text-accent-blue-light flex items-center justify-center">
                  <Database size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">
                    Neon Serverless PostgreSQL
                  </h3>
                  <p className="text-[0.7rem] text-text-muted">
                    Primary transactional datastore & connection pool
                  </p>
                </div>
              </div>

              {initialHealth.database.status === "connected" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                  <CheckCircle2 size={13} /> Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                  <AlertCircle size={13} /> Unreachable
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-bg-primary/40 border border-border-glass/60">
                <div className="text-text-muted text-[0.65rem] uppercase font-bold">Query Latency</div>
                <div className="text-base font-semibold text-text-primary mt-0.5 flex items-center gap-1">
                  <Clock size={13} className="text-cyan-400" />
                  {initialHealth.database.latencyMs} ms
                </div>
              </div>

              <div className="p-3 rounded-lg bg-bg-primary/40 border border-border-glass/60">
                <div className="text-text-muted text-[0.65rem] uppercase font-bold">Developers (TIDs)</div>
                <div className="text-base font-semibold text-text-primary mt-0.5">
                  {initialHealth.counts.developers}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-bg-primary/40 border border-border-glass/60">
                <div className="text-text-muted text-[0.65rem] uppercase font-bold">Articles & Jobs</div>
                <div className="text-base font-semibold text-text-primary mt-0.5">
                  {initialHealth.counts.posts} posts · {initialHealth.counts.jobs} jobs
                </div>
              </div>

              <div className="p-3 rounded-lg bg-bg-primary/40 border border-border-glass/60">
                <div className="text-text-muted text-[0.65rem] uppercase font-bold">Comments</div>
                <div className="text-base font-semibold text-text-primary mt-0.5">
                  {initialHealth.counts.comments}
                </div>
              </div>
            </div>
          </div>

          {/* Third-Party Integrations */}
          <div className="bg-bg-card border border-border-glass rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-text-primary mb-1">
              External Cloud Services
            </h3>
            <p className="text-xs text-text-muted mb-4">
              Real-time API key and credential detection for ecosystem dependencies.
            </p>

            <div className="divide-y divide-border-glass/50">
              {/* Resend */}
              <div className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">
                      Resend Email Delivery
                    </div>
                    <div className="text-xs text-text-muted">
                      Automated TID Welcome emails & notifications
                    </div>
                  </div>
                </div>
                {initialHealth.services.resend.configured ? (
                  <span className="text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={12} /> Configured
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <AlertCircle size={12} /> Missing Key
                  </span>
                )}
              </div>

              {/* Cloudinary */}
              <div className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <ImageIcon size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">
                      Cloudinary Media Storage
                    </div>
                    <div className="text-xs text-text-muted">
                      Post cover images & inline editor uploads
                    </div>
                  </div>
                </div>
                {initialHealth.services.cloudinary.configured ? (
                  <span className="text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={12} /> Configured
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <AlertCircle size={12} /> Missing Key
                  </span>
                )}
              </div>

              {/* Google Gemini AI */}
              <div className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">
                      Google Gemini 2.5 Flash
                    </div>
                    <div className="text-xs text-text-muted">
                      AI-assisted SEO excerpts & meta copy generation
                    </div>
                  </div>
                </div>
                {initialHealth.services.gemini.configured ? (
                  <span className="text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={12} /> Configured
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <AlertCircle size={12} /> Missing Key
                  </span>
                )}
              </div>

              {/* NextAuth Secret */}
              <div className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">
                      NextAuth Cryptographic Secret
                    </div>
                    <div className="text-xs text-text-muted">
                      JWT session token signing & encryption
                    </div>
                  </div>
                </div>
                {initialHealth.services.nextAuth.configured ? (
                  <span className="text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={12} /> Configured
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <AlertCircle size={12} /> Unset
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ECOSYSTEM INFO */}
      {activeTab === "info" && (
        <div className="bg-bg-card border border-border-glass rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-text-primary mb-1">
            Platform Quick Links
          </h3>
          <p className="text-xs text-text-muted mb-4">
            Direct navigation to public landing pages and entry portals.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/"
              target="_blank"
              className="p-3.5 rounded-lg bg-bg-primary/50 border border-border-glass hover:border-accent-blue-glow transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-semibold text-text-primary group-hover:text-accent-blue-light transition-colors">
                  Main Landing Page
                </div>
                <div className="text-[0.7rem] text-text-muted">techfamz.com/</div>
              </div>
              <ExternalLink size={14} className="text-text-muted" />
            </Link>

            <Link
              href="/identity/claim"
              target="_blank"
              className="p-3.5 rounded-lg bg-bg-primary/50 border border-border-glass hover:border-accent-blue-glow transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-semibold text-text-primary group-hover:text-accent-blue-light transition-colors">
                  TID Claim Portal
                </div>
                <div className="text-[0.7rem] text-text-muted">techfamz.com/identity/claim</div>
              </div>
              <ExternalLink size={14} className="text-text-muted" />
            </Link>

            <Link
              href="/blog"
              target="_blank"
              className="p-3.5 rounded-lg bg-bg-primary/50 border border-border-glass hover:border-accent-blue-glow transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-semibold text-text-primary group-hover:text-accent-blue-light transition-colors">
                  Engineering Blog
                </div>
                <div className="text-[0.7rem] text-text-muted">techfamz.com/blog</div>
              </div>
              <ExternalLink size={14} className="text-text-muted" />
            </Link>

            <Link
              href="/jobs"
              target="_blank"
              className="p-3.5 rounded-lg bg-bg-primary/50 border border-border-glass hover:border-accent-blue-glow transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-semibold text-text-primary group-hover:text-accent-blue-light transition-colors">
                  Tech Jobs Directory
                </div>
                <div className="text-[0.7rem] text-text-muted">techfamz.com/jobs</div>
              </div>
              <ExternalLink size={14} className="text-text-muted" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
