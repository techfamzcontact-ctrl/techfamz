"use client";

import { useState, useMemo, useTransition } from "react";
import {
  deleteDeveloper,
  createDeveloperAdmin,
  updateDeveloperAdmin,
} from "@/app/admin/actions";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  Search,
  Download,
  ExternalLink,
  Trash2,
  Copy,
  Check,
  Users,
  Globe,
  Briefcase,
  X,
  Code2,
  Plus,
  Pencil,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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

export default function DevelopersClient({
  initialDevelopers,
}: {
  initialDevelopers: Developer[];
}) {
  const [developers, setDevelopers] = useState<Developer[]>(initialDevelopers);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedCountry, setSelectedCountry] = useState("ALL");
  const [copiedTid, setCopiedTid] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createRole, setCreateRole] = useState(POPULAR_ROLES[0]);
  const [createSkills, setCreateSkills] = useState("");
  const [createCountry, setCreateCountry] = useState("");
  const [createGithub, setCreateGithub] = useState("");
  const [createSendEmail, setCreateSendEmail] = useState(true);
  const [createError, setCreateError] = useState("");

  // Edit Modal State
  const [editingDev, setEditingDev] = useState<Developer | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editSkills, setEditSkills] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [editError, setEditError] = useState("");

  // Extract unique roles and countries for filter dropdowns
  const availableRoles = useMemo(() => {
    const roles = Array.from(new Set(developers.map((d) => d.role).filter(Boolean)));
    return roles.sort();
  }, [developers]);

  const availableCountries = useMemo(() => {
    const countries = Array.from(new Set(developers.map((d) => d.country).filter(Boolean))) as string[];
    return countries.sort();
  }, [developers]);

  // Filtered developers
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
        (dev.country && dev.country.toLowerCase().includes(q));

      const matchesRole = selectedRole === "ALL" || dev.role === selectedRole;
      const matchesCountry = selectedCountry === "ALL" || dev.country === selectedCountry;

      return matchesSearch && matchesRole && matchesCountry;
    });
  }, [developers, search, selectedRole, selectedCountry]);

  // Copy to clipboard
  const handleCopyTid = (tid: string) => {
    navigator.clipboard.writeText(tid);
    setCopiedTid(tid);
    setTimeout(() => setCopiedTid(null), 2000);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Delete developer
  const handleDelete = (id: string, name: string, tid: string) => {
    if (!confirm(`Are you sure you want to delete ${name} (${tid})? This cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteDeveloper(id);
        setDevelopers((prev) => prev.filter((d) => d.id !== id));
      } catch (err) {
        console.error("Failed to delete developer:", err);
        alert("Failed to delete developer. Please try again.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  // Open Edit Modal
  const openEditModal = (dev: Developer) => {
    setEditingDev(dev);
    setEditName(dev.fullName);
    setEditEmail(dev.email);
    setEditRole(dev.role);
    setEditSkills(dev.skills.join(", "));
    setEditCountry(dev.country || "");
    setEditGithub(dev.githubUrl || "");
    setEditError("");
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDev) return;

    setEditError("");
    const parsedSkills = editSkills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    startTransition(async () => {
      try {
        const updated = await updateDeveloperAdmin(editingDev.id, {
          fullName: editName,
          email: editEmail,
          role: editRole,
          skills: parsedSkills,
          githubUrl: editGithub || undefined,
          country: editCountry || undefined,
        });

        setDevelopers((prev) =>
          prev.map((d) => (d.id === updated.id ? { ...d, ...updated } : d))
        );
        setEditingDev(null);
      } catch (err) {
        setEditError(err instanceof Error ? err.message : "Failed to update developer");
      }
    });
  };

  // Handle Create Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");

    const parsedSkills = createSkills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    startTransition(async () => {
      try {
        const created = await createDeveloperAdmin({
          fullName: createName,
          email: createEmail,
          role: createRole,
          skills: parsedSkills,
          country: createCountry || undefined,
          githubUrl: createGithub || undefined,
          sendEmail: createSendEmail,
        });

        setDevelopers((prev) => [created, ...prev]);
        setIsCreateOpen(false);

        // Reset form
        setCreateName("");
        setCreateEmail("");
        setCreateRole(POPULAR_ROLES[0]);
        setCreateSkills("");
        setCreateCountry("");
        setCreateGithub("");
      } catch (err) {
        setCreateError(err instanceof Error ? err.message : "Failed to create developer");
      }
    });
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "TID",
      "Full Name",
      "Email",
      "Role",
      "Skills",
      "Country",
      "GitHub URL",
      "Created At",
    ];

    const rows = filteredDevelopers.map((dev) => [
      `"${dev.tid}"`,
      `"${dev.fullName.replace(/"/g, '""')}"`,
      `"${dev.email.replace(/"/g, '""')}"`,
      `"${dev.role.replace(/"/g, '""')}"`,
      `"${dev.skills.join("; ").replace(/"/g, '""')}"`,
      `"${(dev.country || "").replace(/"/g, '""')}"`,
      `"${(dev.githubUrl || "").replace(/"/g, '""')}"`,
      `"${new Date(dev.createdAt).toISOString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    const dateStr = format(new Date(), "yyyy-MM-dd");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `techfamz-developers-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">
              Developers & TIDs
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue-light border border-accent-blue-glow/30">
              {developers.length} Registered
            </span>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Directory of verified Techfamz Identity (TID) holders across Africa and beyond.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-accent-blue hover:bg-blue-600 text-white shadow-[0_0_15px_var(--color-accent-blue-glow-soft)] flex items-center gap-1.5 text-xs font-semibold"
          >
            <Plus size={15} />
            <span>Issue TID</span>
          </Button>

          <button
            onClick={handleExportCSV}
            disabled={filteredDevelopers.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-bg-card border border-border-glass text-text-primary hover:text-accent-blue-light hover:border-accent-blue-glow transition-all text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-bg-card border border-border-glass rounded-xl p-5 relative overflow-hidden group hover:border-accent-blue-glow transition-all">
          <div className="absolute -right-3 -top-3 text-accent-blue-light/5 group-hover:text-accent-blue-light/10 transition-colors">
            <Users size={70} />
          </div>
          <div className="text-text-muted text-[0.68rem] font-bold uppercase tracking-wider mb-1 relative z-10">
            Total Verified TIDs
          </div>
          <div className="text-3xl font-bold text-text-primary relative z-10">
            {developers.length}
          </div>
          <div className="text-xs text-accent-blue-light mt-1 relative z-10">
            Active identity holders
          </div>
        </div>

        <div className="bg-bg-card border border-border-glass rounded-xl p-5 relative overflow-hidden group hover:border-accent-blue-glow transition-all">
          <div className="absolute -right-3 -top-3 text-green-400/5 group-hover:text-green-400/10 transition-colors">
            <Briefcase size={70} />
          </div>
          <div className="text-text-muted text-[0.68rem] font-bold uppercase tracking-wider mb-1 relative z-10">
            Technical Roles
          </div>
          <div className="text-3xl font-bold text-text-primary relative z-10">
            {availableRoles.length}
          </div>
          <div className="text-xs text-green-400 mt-1 relative z-10">
            Specialized engineering domains
          </div>
        </div>

        <div className="bg-bg-card border border-border-glass rounded-xl p-5 relative overflow-hidden group hover:border-accent-blue-glow transition-all">
          <div className="absolute -right-3 -top-3 text-amber-400/5 group-hover:text-amber-400/10 transition-colors">
            <Globe size={70} />
          </div>
          <div className="text-text-muted text-[0.68rem] font-bold uppercase tracking-wider mb-1 relative z-10">
            Countries Represented
          </div>
          <div className="text-3xl font-bold text-text-primary relative z-10">
            {availableCountries.length || 1}
          </div>
          <div className="text-xs text-amber-400 mt-1 relative z-10">
            Geographic reach
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-bg-card border border-border-glass rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search by name, email, TID (e.g. TF...), role, skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-bg-primary border border-border-glass rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Role Filter */}
        <div className="w-full md:w-48">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full py-2 px-3 bg-bg-primary border border-border-glass rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue transition-colors"
          >
            <option value="ALL">All Roles ({developers.length})</option>
            {availableRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Country Filter */}
        <div className="w-full md:w-44">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full py-2 px-3 bg-bg-primary border border-border-glass rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue transition-colors"
          >
            <option value="ALL">All Countries</option>
            {availableCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters button if any are applied */}
        {(search || selectedRole !== "ALL" || selectedCountry !== "ALL") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedRole("ALL");
              setSelectedCountry("ALL");
            }}
            className="text-xs text-text-muted hover:text-accent-blue-light transition-colors px-2 py-2 text-center whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Developers Table */}
      <div className="bg-bg-card border border-border-glass rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-secondary border-collapse">
            <thead className="bg-bg-primary/60 border-b border-border-glass text-[0.7rem] uppercase tracking-wider text-text-muted font-bold">
              <tr>
                <th className="px-5 py-3.5">Developer</th>
                <th className="px-5 py-3.5">TID Code</th>
                <th className="px-5 py-3.5">Role & Skills</th>
                <th className="px-5 py-3.5">Country</th>
                <th className="px-5 py-3.5">Joined</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-glass">
              {filteredDevelopers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-text-muted">
                    <Users size={36} className="mx-auto mb-3 opacity-30" />
                    <p className="text-base font-medium text-text-secondary">
                      No developers found
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {search || selectedRole !== "ALL" || selectedCountry !== "ALL"
                        ? "Try adjusting your search criteria or clearing filters."
                        : "No developers have claimed a TID yet."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredDevelopers.map((dev) => {
                  const dateStr = dev.createdAt
                    ? format(new Date(dev.createdAt), "MMM d, yyyy")
                    : "—";

                  return (
                    <tr
                      key={dev.id}
                      className="hover:bg-bg-primary/40 transition-colors group"
                    >
                      {/* Name & Email */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-text-primary flex items-center gap-1.5">
                          <span>{dev.fullName}</span>
                          {dev.githubUrl && (
                            <a
                              href={
                                dev.githubUrl.startsWith("http")
                                  ? dev.githubUrl
                                  : `https://${dev.githubUrl}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-text-muted hover:text-accent-blue-light transition-colors"
                              title="GitHub Profile"
                            >
                              <Code2 size={13} />
                            </a>
                          )}
                        </div>
                        <div className="text-xs text-text-muted flex items-center gap-1.5 mt-0.5">
                          <span>{dev.email}</span>
                          <button
                            onClick={() => handleCopyEmail(dev.email)}
                            className="text-text-muted hover:text-text-primary transition-colors"
                            title="Copy email"
                          >
                            {copiedEmail === dev.email ? (
                              <Check size={12} className="text-green-400" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* TID Badge */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-md bg-accent-blue-glow-soft border border-accent-blue-glow text-accent-blue-light">
                          <span>{dev.tid}</span>
                          <button
                            onClick={() => handleCopyTid(dev.tid)}
                            className="hover:text-white transition-colors"
                            title="Copy TID"
                          >
                            {copiedTid === dev.tid ? (
                              <Check size={12} className="text-green-400" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Role & Skills */}
                      <td className="px-5 py-4">
                        <div className="text-xs font-medium text-text-primary mb-1">
                          {dev.role}
                        </div>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {dev.skills && dev.skills.length > 0 ? (
                            dev.skills.slice(0, 3).map((skill, i) => (
                              <span
                                key={i}
                                className="text-[0.65rem] px-1.5 py-0.5 rounded bg-bg-primary border border-border-glass text-text-muted"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-text-muted italic">
                              No skills listed
                            </span>
                          )}
                          {dev.skills && dev.skills.length > 3 && (
                            <span className="text-[0.65rem] px-1.5 py-0.5 rounded bg-bg-primary text-text-muted">
                              +{dev.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Country */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-text-secondary">
                        {dev.country || "—"}
                      </td>

                      {/* Joined Date */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-xs text-text-secondary">{dateStr}</div>
                        {dev.createdAt && (
                          <div className="text-[0.65rem] text-text-muted">
                            {formatDistanceToNow(new Date(dev.createdAt), {
                              addSuffix: true,
                            })}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(dev)}
                            className="p-1.5 rounded-lg text-text-muted hover:text-accent-blue-light hover:bg-bg-primary transition-colors"
                            title="Edit Developer"
                          >
                            <Pencil size={15} />
                          </button>

                          <Link
                            href={`/tid/${dev.tid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-text-muted hover:text-cyan-400 hover:bg-bg-primary transition-colors"
                            title="View Public TID Card"
                          >
                            <ExternalLink size={15} />
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(dev.id, dev.fullName, dev.tid)
                            }
                            disabled={deletingId === dev.id || isPending}
                            className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                            title="Delete Developer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        {filteredDevelopers.length > 0 && (
          <div className="px-5 py-3 border-t border-border-glass bg-bg-primary/30 flex items-center justify-between text-xs text-text-muted">
            <span>
              Showing {filteredDevelopers.length} of {developers.length} developers
            </span>
            <span>Techfamz Identity Directory</span>
          </div>
        )}
      </div>

      {/* CREATE DEVELOPER / ISSUE TID MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg bg-bg-card border-border-glass text-text-primary">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-text-primary">
              Issue Techfamz Identity (TID)
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted">
              Manually register a developer and issue an official verified TID.
            </DialogDescription>
          </DialogHeader>

          {createError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{createError}</span>
            </div>
          )}

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 block">
                Full Name *
              </Label>
              <Input
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                required
                placeholder="e.g. Samuel Adeyemi"
                className="bg-bg-primary border-border-glass text-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 block">
                Email Address *
              </Label>
              <Input
                type="email"
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                required
                placeholder="samuel@example.com"
                className="bg-bg-primary border-border-glass text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 block">
                  Technical Role *
                </Label>
                <select
                  value={createRole}
                  onChange={(e) => setCreateRole(e.target.value)}
                  className="w-full h-9 rounded-md border border-border-glass bg-bg-primary text-text-primary px-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue"
                >
                  {POPULAR_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 block">
                  Country
                </Label>
                <Input
                  value={createCountry}
                  onChange={(e) => setCreateCountry(e.target.value)}
                  placeholder="e.g. Nigeria, Ghana, Kenya"
                  className="bg-bg-primary border-border-glass text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 block">
                Key Skills (comma separated)
              </Label>
              <Input
                value={createSkills}
                onChange={(e) => setCreateSkills(e.target.value)}
                placeholder="React, TypeScript, Node.js, GraphQL"
                className="bg-bg-primary border-border-glass text-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 block">
                GitHub Profile URL
              </Label>
              <Input
                value={createGithub}
                onChange={(e) => setCreateGithub(e.target.value)}
                placeholder="github.com/username"
                className="bg-bg-primary border-border-glass text-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="sendEmailCheckbox"
                checked={createSendEmail}
                onChange={(e) => setCreateSendEmail(e.target.checked)}
                className="rounded border-border-glass text-accent-blue focus:ring-accent-blue cursor-pointer"
              />
              <label
                htmlFor="sendEmailCheckbox"
                className="text-xs text-text-secondary cursor-pointer select-none"
              >
                Send welcome email with digital card & verification link via Resend
              </label>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-accent-blue hover:bg-blue-600 text-white text-xs"
              >
                {isPending ? "Generating TID..." : "Generate & Issue TID"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DEVELOPER MODAL */}
      <Dialog
        open={Boolean(editingDev)}
        onOpenChange={(open) => !open && setEditingDev(null)}
      >
        <DialogContent className="sm:max-w-lg bg-bg-card border-border-glass text-text-primary">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-text-primary flex items-center gap-2">
              <span>Edit Developer Profile</span>
              {editingDev && (
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-accent-blue-glow-soft text-accent-blue-light border border-accent-blue-glow">
                  {editingDev.tid}
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted">
              Update developer metadata, verified skills, and external profiles.
            </DialogDescription>
          </DialogHeader>

          {editError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{editError}</span>
            </div>
          )}

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 block">
                Full Name *
              </Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="bg-bg-primary border-border-glass text-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 block">
                Email Address *
              </Label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
                className="bg-bg-primary border-border-glass text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 block">
                  Technical Role *
                </Label>
                <Input
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  required
                  className="bg-bg-primary border-border-glass text-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 block">
                  Country
                </Label>
                <Input
                  value={editCountry}
                  onChange={(e) => setEditCountry(e.target.value)}
                  placeholder="e.g. Nigeria"
                  className="bg-bg-primary border-border-glass text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 block">
                Key Skills (comma separated)
              </Label>
              <Input
                value={editSkills}
                onChange={(e) => setEditSkills(e.target.value)}
                placeholder="React, TypeScript, Python"
                className="bg-bg-primary border-border-glass text-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 block">
                GitHub Profile URL
              </Label>
              <Input
                value={editGithub}
                onChange={(e) => setEditGithub(e.target.value)}
                placeholder="https://github.com/..."
                className="bg-bg-primary border-border-glass text-sm"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingDev(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-accent-blue hover:bg-blue-600 text-white text-xs"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
