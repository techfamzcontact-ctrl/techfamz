"use client";

import { useMemo, useRef, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  AlertCircle,
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { createDeveloperAdmin, deleteDeveloper, updateDeveloperAdmin } from "@/app/admin/actions";
import {
  EmptyState,
  PageHeader,
  Panel,
  StatCard,
  adminInputClass,
  adminLabelClass,
  adminTable,
} from "@/components/admin/AdminUI";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import { runAction } from "@/components/admin/run-action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface Developer {
  id: string;
  tid: string;
  fullName: string;
  email: string;
  role: string;
  skills: string[];
  githubUrl: string | null;
  country: string | null;
  createdAt: Date | string;
}

/** Same list as the public claim form (app/api/tid/route.ts). */
const POPULAR_ROLES = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full-Stack Developer",
  "Mobile Developer",
  "DevOps Engineer",
  "Data Scientist",
  "UI/UX Designer",
  "Cloud Engineer",
  "Cybersecurity Specialist",
  "AI/ML Engineer",
  "Other",
];

const CUSTOM_ROLE = "__custom__";
const VISIBLE_SKILLS = 3;
const NETWORK_ERROR = "Something went wrong. Check your connection and try again.";

type FormValues = {
  fullName: string;
  email: string;
  role: string;
  skills: string;
  country: string;
  githubUrl: string;
};

const EMPTY_FORM: FormValues = {
  fullName: "",
  email: "",
  role: POPULAR_ROLES[0],
  skills: "",
  country: "",
  githubUrl: "",
};

function valuesFromDeveloper(dev: Developer): FormValues {
  return {
    fullName: dev.fullName,
    email: dev.email,
    role: dev.role,
    skills: dev.skills.join(", "),
    country: dev.country ?? "",
    githubUrl: dev.githubUrl ?? "",
  };
}

function toDeveloperInput(values: FormValues) {
  return {
    fullName: values.fullName,
    email: values.email,
    role: values.role,
    skills: values.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0),
    country: values.country || undefined,
    githubUrl: values.githubUrl || undefined,
  };
}

function githubHref(url: string) {
  return url.startsWith("http") ? url : `https://${url}`;
}

/** Fixed locale, so the server render and the browser agree (no hydration mismatch). */
function formatCount(n: number) {
  return n.toLocaleString("en-US");
}

function plural(n: number, word: string) {
  return `${formatCount(n)} ${word}${n === 1 ? "" : "s"}`;
}

/** Count how often each value appears, most common first. */
function countBy(values: string[]) {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return counts;
}

function mostCommon(counts: Map<string, number>) {
  let best: string | null = null;
  let bestCount = 0;
  for (const [value, count] of counts) {
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  }
  return best;
}

async function copyToClipboard(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
    return true;
  } catch {
    toast.error("Couldn't copy to the clipboard.");
    return false;
  }
}

// ─── CSV export ───

/**
 * Spreadsheet apps run cells that start with these characters as formulas
 * (CSV injection), so such values are prefixed with a single quote.
 */
const FORMULA_START = /^[=+\-@\t\r]/;

function csvCell(value: string) {
  const safe = FORMULA_START.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

function buildDevelopersCsv(developers: Developer[]) {
  const header = ["TID", "Full Name", "Email", "Role", "Skills", "Country", "GitHub URL", "Created At"];
  const rows = developers.map((dev) => [
    dev.tid,
    dev.fullName,
    dev.email,
    dev.role,
    dev.skills.join("; "),
    dev.country ?? "",
    dev.githubUrl ?? "",
    new Date(dev.createdAt).toISOString(),
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

function downloadCsv(csv: string, filename: string) {
  // The BOM lets Excel detect UTF-8, so accented names display correctly.
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoke after the browser has started the download.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ─── Page ───

export default function DevelopersClient({ initialDevelopers }: { initialDevelopers: Developer[] }) {
  const confirm = useConfirm();
  const [developers, setDevelopers] = useState<Developer[]>(initialDevelopers);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  // Row state
  const [copiedTid, setCopiedTid] = useState<string | null>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Create / edit dialog. `editing` is null in create mode and is kept while
  // the dialog closes, so its content doesn't change during the exit animation.
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Developer | null>(null);
  const [createValues, setCreateValues] = useState<FormValues>(EMPTY_FORM);
  const [editValues, setEditValues] = useState<FormValues>(EMPTY_FORM);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const roleCounts = useMemo(() => countBy(developers.map((d) => d.role).filter(Boolean)), [developers]);
  const countryCounts = useMemo(
    () => countBy(developers.map((d) => d.country).filter((c): c is string => Boolean(c))),
    [developers]
  );
  const availableRoles = useMemo(() => Array.from(roleCounts.keys()).sort(), [roleCounts]);
  const availableCountries = useMemo(() => Array.from(countryCounts.keys()).sort(), [countryCounts]);
  const topRole = mostCommon(roleCounts);
  const topCountry = mostCommon(countryCounts);

  const filteredDevelopers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return developers.filter((dev) => {
      const matchesSearch =
        !q ||
        dev.fullName.toLowerCase().includes(q) ||
        dev.email.toLowerCase().includes(q) ||
        dev.tid.toLowerCase().includes(q) ||
        dev.role.toLowerCase().includes(q) ||
        dev.skills.some((s) => s.toLowerCase().includes(q)) ||
        (dev.country?.toLowerCase().includes(q) ?? false);
      const matchesRole = !selectedRole || dev.role === selectedRole;
      const matchesCountry = !selectedCountry || dev.country === selectedCountry;
      return matchesSearch && matchesRole && matchesCountry;
    });
  }, [developers, search, selectedRole, selectedCountry]);

  const hasFilters = Boolean(search || selectedRole || selectedCountry);

  const clearFilters = () => {
    setSearch("");
    setSelectedRole("");
    setSelectedCountry("");
  };

  // ─── Actions ───

  const handleCopyTid = async (tid: string) => {
    if (!(await copyToClipboard(tid, "TID"))) return;
    setCopiedTid(tid);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopiedTid(null), 2000);
  };

  const openCreate = () => {
    setEditing(null);
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (dev: Developer) => {
    setEditing(dev);
    setEditValues(valuesFromDeveloper(dev));
    setFormError("");
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setFormError("");
    setSaving(true);

    try {
      if (editing) {
        const result = await updateDeveloperAdmin(editing.id, toDeveloperInput(editValues));
        if (!result.ok) {
          setFormError(result.error);
          return;
        }
        const updated = result.data;
        setDevelopers((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
        setFormOpen(false);
        toast.success(`Saved changes to ${updated.fullName}`);
      } else {
        const result = await createDeveloperAdmin({
          ...toDeveloperInput(createValues),
          sendEmail: sendWelcomeEmail,
        });
        if (!result.ok) {
          setFormError(result.error);
          return;
        }
        const created = result.data;
        setDevelopers((prev) => [created, ...prev]);
        setFormOpen(false);
        setCreateValues(EMPTY_FORM);
        toast.success(`Issued ${created.tid} to ${created.fullName}`, {
          action: { label: "Copy TID", onClick: () => void copyToClipboard(created.tid, "TID") },
        });
      }
    } catch (err) {
      console.error(err);
      setFormError(NETWORK_ERROR);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (dev: Developer) => {
    const ok = await confirm({
      title: `Delete ${dev.fullName}?`,
      description: `This permanently removes the developer and their TID ${dev.tid}. Their public TID page will stop working. This cannot be undone.`,
      confirmLabel: "Delete developer",
      destructive: true,
    });
    if (!ok) return;

    setDeletingId(dev.id);
    const result = await runAction(deleteDeveloper(dev.id), `Deleted ${dev.fullName} (${dev.tid})`);
    setDeletingId(null);
    if (result) setDevelopers((prev) => prev.filter((d) => d.id !== dev.id));
  };

  const handleExportCsv = () => {
    if (filteredDevelopers.length === 0) return;
    downloadCsv(
      buildDevelopersCsv(filteredDevelopers),
      `techfamz-developers-${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    toast.success(`Exported ${plural(filteredDevelopers.length, "developer")}`);
  };

  const formValues = editing ? editValues : createValues;
  const setFormValues = editing ? setEditValues : setCreateValues;

  return (
    <div>
      <PageHeader
        title="Developers & TIDs"
        description="Everyone who holds a Techfamz Identity (TID). Skills and other profile details are self-reported."
        actions={
          <>
            <Button
              variant="outline"
              size="xs"
              onClick={handleExportCsv}
              disabled={filteredDevelopers.length === 0}
              title={
                hasFilters
                  ? `Export the ${plural(filteredDevelopers.length, "developer")} that match your filters`
                  : "Export all developers"
              }
            >
              <Download size={14} />
              Export CSV
            </Button>
            <Button size="xs" onClick={openCreate}>
              <Plus size={14} />
              Add developer
            </Button>
          </>
        }
      />

      {/* Key numbers */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatCard label="TID holders" value={formatCount(developers.length)} hint="Registered developers" />
        <StatCard
          label="Roles"
          value={availableRoles.length}
          hint={topRole ? `Most common: ${topRole}` : "None yet"}
        />
        <StatCard
          label="Countries"
          value={availableCountries.length}
          hint={topCountry ? `Most common: ${topCountry}` : "None given yet"}
        />
      </div>

      <Panel>
        {/* Toolbar */}
        <div className="flex flex-col gap-2 border-b border-border-glass p-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, TID, role, skill or country"
              aria-label="Search developers"
              className={cn(adminInputClass, "pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden")}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                title="Clear search"
                className="absolute right-1.5 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded text-text-muted transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/40"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            aria-label="Filter by role"
            className={cn(adminInputClass, "md:w-52")}
          >
            <option value="">All roles</option>
            {availableRoles.map((role) => (
              <option key={role} value={role}>
                {role} ({roleCounts.get(role)})
              </option>
            ))}
          </select>

          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            aria-label="Filter by country"
            className={cn(adminInputClass, "md:w-44")}
          >
            <option value="">All countries</option>
            {availableCountries.map((country) => (
              <option key={country} value={country}>
                {country} ({countryCounts.get(country)})
              </option>
            ))}
          </select>

          {hasFilters && (
            <Button variant="ghost" size="xs" onClick={clearFilters} className="self-start md:self-auto">
              Clear filters
            </Button>
          )}
        </div>

        {developers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No TID holders yet"
            description="Developers appear here when they claim a TID on /identity/claim, or when you add one."
            action={
              <Button size="xs" onClick={openCreate}>
                <Plus size={14} />
                Add developer
              </Button>
            }
          />
        ) : filteredDevelopers.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No developers match your filters"
            description="Try a different search term, or clear the filters."
            action={
              <Button variant="outline" size="xs" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            <div className={adminTable.wrapper}>
              <table className={adminTable.table}>
                <thead>
                  <tr>
                    <th className={adminTable.th}>Developer</th>
                    <th className={adminTable.th}>TID</th>
                    <th className={adminTable.th}>Role</th>
                    <th className={adminTable.th}>Skills</th>
                    <th className={adminTable.th}>Country</th>
                    <th className={adminTable.th}>Registered</th>
                    <th className={cn(adminTable.th, "text-right")}>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDevelopers.map((dev) => (
                    <DeveloperRow
                      key={dev.id}
                      dev={dev}
                      copied={copiedTid === dev.tid}
                      deleting={deletingId === dev.id}
                      onCopyTid={() => void handleCopyTid(dev.tid)}
                      onEdit={() => openEdit(dev)}
                      onDelete={() => void handleDelete(dev)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border-glass px-4 py-2.5 text-xs text-text-muted">
              Showing {formatCount(filteredDevelopers.length)} of {plural(developers.length, "developer")}
            </div>
          </>
        )}
      </Panel>

      {/* Create / edit dialog */}
      <Dialog open={formOpen} onOpenChange={(open) => !saving && setFormOpen(open)}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto bg-bg-card ring-border-glass sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex flex-wrap items-center gap-2 text-base font-semibold text-text-primary">
              {editing ? "Edit developer" : "Add developer"}
              {editing && <span className="font-mono text-xs font-medium text-accent-blue-light">{editing.tid}</span>}
            </DialogTitle>
            <DialogDescription className="text-sm text-text-muted">
              {editing
                ? "Changes show on the public TID page straight away. The TID itself can't be changed."
                : "Registers the developer and issues a new random TID with a public page at /tid/[tid]."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <DeveloperFields
              idPrefix={editing ? "edit" : "create"}
              values={formValues}
              onChange={(patch) => setFormValues((prev) => ({ ...prev, ...patch }))}
              disabled={saving}
            />

            {!editing && (
              <label className="flex cursor-pointer items-start gap-2 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={sendWelcomeEmail}
                  onChange={(e) => setSendWelcomeEmail(e.target.checked)}
                  disabled={saving}
                  className="mt-0.5 size-4 shrink-0 cursor-pointer accent-accent-blue"
                />
                <span>
                  Send the welcome email with their TID and public page link
                  <span className="block text-xs text-text-muted">Only sent when Resend is configured.</span>
                </span>
              </label>
            )}

            <DialogFooter className="border-border-glass bg-bg-secondary">
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => setFormOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" size="xs" disabled={saving}>
                {saving ? (editing ? "Saving…" : "Issuing TID…") : editing ? "Save changes" : "Add and issue TID"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Table row ───

function DeveloperRow({
  dev,
  copied,
  deleting,
  onCopyTid,
  onEdit,
  onDelete,
}: {
  dev: Developer;
  copied: boolean;
  deleting: boolean;
  onCopyTid: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const created = new Date(dev.createdAt);
  const extraSkills = dev.skills.slice(VISIBLE_SKILLS);

  return (
    <tr className={cn(adminTable.tr, deleting && "opacity-50")} aria-busy={deleting || undefined}>
      {/* Name and email */}
      <td className={cn(adminTable.td, "min-w-50")}>
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate font-medium text-text-primary">{dev.fullName}</span>
          {dev.githubUrl && (
            <a
              href={githubHref(dev.githubUrl)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub profile of ${dev.fullName}`}
              title="GitHub profile"
              className="shrink-0 rounded text-text-muted transition-colors hover:text-text-primary"
            >
              <Code2 size={14} />
            </a>
          )}
        </div>
        <div className="mt-0.5 truncate text-xs text-text-muted">{dev.email}</div>
      </td>

      {/* TID */}
      <td className={cn(adminTable.td, "whitespace-nowrap")}>
        <div className="inline-flex items-center gap-1">
          <a
            href={`/tid/${dev.tid}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Open public TID page"
            className="font-mono text-xs font-medium text-accent-blue-light hover:underline underline-offset-2"
          >
            {dev.tid}
          </a>
          <button
            type="button"
            onClick={onCopyTid}
            aria-label={`Copy TID ${dev.tid}`}
            title="Copy TID"
            className="inline-flex size-6 items-center justify-center rounded text-text-muted transition-colors hover:bg-text-primary/5 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/40"
          >
            {copied ? (
              <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        </div>
      </td>

      {/* Role */}
      <td className={cn(adminTable.td, "whitespace-nowrap text-text-secondary")}>{dev.role}</td>

      {/* Skills */}
      <td className={adminTable.td}>
        {dev.skills.length === 0 ? (
          <span className="text-text-muted">—</span>
        ) : (
          <div className="flex max-w-65 flex-wrap gap-1">
            {dev.skills.slice(0, VISIBLE_SKILLS).map((skill, i) => (
              <span
                key={`${skill}-${i}`}
                className="max-w-35 truncate rounded border border-border-glass px-1.5 py-0.5 text-xs text-text-secondary"
                title={skill}
              >
                {skill}
              </span>
            ))}
            {extraSkills.length > 0 && (
              <span className="px-1 py-0.5 text-xs text-text-muted" title={extraSkills.join(", ")}>
                +{extraSkills.length}
              </span>
            )}
          </div>
        )}
      </td>

      {/* Country */}
      <td className={cn(adminTable.td, "whitespace-nowrap text-text-secondary")}>
        {dev.country || <span className="text-text-muted">—</span>}
      </td>

      {/* Registered */}
      <td className={cn(adminTable.td, "whitespace-nowrap")}>
        <time
          dateTime={created.toISOString()}
          className="block text-text-secondary"
          suppressHydrationWarning
        >
          {format(created, "MMM d, yyyy")}
        </time>
        <span className="block text-xs text-text-muted" suppressHydrationWarning>
          {formatDistanceToNow(created, { addSuffix: true })}
        </span>
      </td>

      {/* Actions */}
      <td className={cn(adminTable.td, "w-12 text-right")}>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={deleting}
              aria-label={`Actions for ${dev.fullName}`}
              title="Actions"
              className="text-text-muted hover:text-text-primary"
            >
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onSelect={onEdit}>
              <Pencil size={14} />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onCopyTid}>
              <Copy size={14} />
              Copy TID
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => void copyToClipboard(dev.email, "Email")}>
              <Mail size={14} />
              Copy email
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={`/tid/${dev.tid}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={14} />
                Open public page
              </a>
            </DropdownMenuItem>
            {dev.githubUrl && (
              <DropdownMenuItem asChild>
                <a href={githubHref(dev.githubUrl)} target="_blank" rel="noopener noreferrer">
                  <Code2 size={14} />
                  Open GitHub profile
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={onDelete}>
              <Trash2 size={14} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

// ─── Form fields (shared by create and edit) ───

function DeveloperFields({
  idPrefix,
  values,
  onChange,
  disabled,
}: {
  idPrefix: string;
  values: FormValues;
  onChange: (patch: Partial<FormValues>) => void;
  disabled: boolean;
}) {
  const id = (name: string) => `${idPrefix}-${name}`;
  // Roles outside the standard list (older records, or typed by an admin) are edited as free text.
  const customRole = !POPULAR_ROLES.includes(values.role);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={id("name")} className={adminLabelClass}>
          Full name
        </label>
        <input
          id={id("name")}
          value={values.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          required
          minLength={2}
          disabled={disabled}
          placeholder="e.g. Samuel Adeyemi"
          autoComplete="off"
          className={adminInputClass}
        />
      </div>

      <div>
        <label htmlFor={id("email")} className={adminLabelClass}>
          Email
        </label>
        <input
          id={id("email")}
          type="email"
          value={values.email}
          onChange={(e) => onChange({ email: e.target.value })}
          required
          disabled={disabled}
          placeholder="samuel@example.com"
          autoComplete="off"
          className={adminInputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={id("role")} className={adminLabelClass}>
            Role
          </label>
          <select
            id={id("role")}
            value={customRole ? CUSTOM_ROLE : values.role}
            onChange={(e) => onChange({ role: e.target.value === CUSTOM_ROLE ? "" : e.target.value })}
            disabled={disabled}
            className={adminInputClass}
          >
            {POPULAR_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
            <option value={CUSTOM_ROLE}>Custom role…</option>
          </select>
        </div>

        <div>
          <label htmlFor={id("country")} className={adminLabelClass}>
            Country <span className="font-normal text-text-muted">(optional)</span>
          </label>
          <input
            id={id("country")}
            value={values.country}
            onChange={(e) => onChange({ country: e.target.value })}
            disabled={disabled}
            placeholder="e.g. Nigeria"
            autoComplete="off"
            className={adminInputClass}
          />
        </div>
      </div>

      {customRole && (
        <div>
          <label htmlFor={id("custom-role")} className={adminLabelClass}>
            Custom role
          </label>
          <input
            id={id("custom-role")}
            value={values.role}
            onChange={(e) => onChange({ role: e.target.value })}
            required
            disabled={disabled}
            placeholder="e.g. Blockchain Developer"
            autoComplete="off"
            className={adminInputClass}
          />
        </div>
      )}

      <div>
        <label htmlFor={id("skills")} className={adminLabelClass}>
          Skills <span className="font-normal text-text-muted">(comma-separated)</span>
        </label>
        <input
          id={id("skills")}
          value={values.skills}
          onChange={(e) => onChange({ skills: e.target.value })}
          disabled={disabled}
          placeholder="React, TypeScript, Node.js"
          autoComplete="off"
          className={adminInputClass}
        />
      </div>

      <div>
        <label htmlFor={id("github")} className={adminLabelClass}>
          GitHub profile <span className="font-normal text-text-muted">(optional)</span>
        </label>
        <input
          id={id("github")}
          value={values.githubUrl}
          onChange={(e) => onChange({ githubUrl: e.target.value })}
          disabled={disabled}
          placeholder="github.com/username"
          autoComplete="off"
          className={adminInputClass}
        />
      </div>
    </div>
  );
}
