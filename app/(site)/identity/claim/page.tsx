"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Fingerprint, Loader2, Lock, Pencil, Plus, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { COMMON_SKILLS, COUNTRY_SUGGESTIONS, MAX_SKILLS, ROLES, STEPS } from "./claim-data";
import { PassportPreview } from "./PassportPreview";
import { Stepper } from "./Stepper";

type FormData = { fullName: string; email: string; country: string; role: string; githubUrl: string };
type Errors = Partial<Record<keyof FormData | "skill", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateStep(step: number, data: FormData): Errors {
  const errors: Errors = {};
  if (step === 0) {
    if (data.fullName.trim().length < 2) errors.fullName = "Enter your full name (at least 2 characters).";
    if (!EMAIL_RE.test(data.email.trim())) errors.email = "Enter a valid email address, like name@example.com.";
  }
  if (step === 1) {
    if (!data.role) errors.role = "Choose the role that fits you best.";
    const link = data.githubUrl.trim();
    if (link && (/\s/.test(link) || !link.includes("."))) {
      errors.githubUrl = "Enter a link like github.com/yourname, or leave it empty.";
    }
  }
  return errors;
}

const labelClass = "mb-1.5 block text-sm font-medium text-text-primary";
const fieldErrorClass = "mt-1.5 text-xs text-red-600 dark:text-red-400";

export default function ClaimTIDPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [formData, setFormData] = useState<FormData>({ fullName: "", email: "", country: "", role: "", githubUrl: "" });
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasNavigated = useRef(false);

  // Move focus to the new step's heading (not on first load, so the page doesn't jump)
  useEffect(() => {
    if (hasNavigated.current) headingRef.current?.focus();
  }, [step]);

  const update = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const goTo = (target: number) => {
    hasNavigated.current = true;
    setErrors({});
    setSubmitError("");
    setStep(target);
    setMaxReached((m) => Math.max(m, target));
  };

  const handleContinue = () => {
    const found = validateStep(step, formData);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      const firstField = Object.keys(found)[0];
      document.getElementById(firstField === "role" ? "role-0" : firstField)?.focus();
      return;
    }
    goTo(step + 1);
  };

  const toggleSkill = (skill: string) => {
    setErrors((prev) => ({ ...prev, skill: undefined }));
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : prev.length < MAX_SKILLS ? [...prev, skill] : prev
    );
  };

  const addCustomSkill = () => {
    const value = customSkill.trim().replace(/\s+/g, " ");
    if (!value) return;
    if (value.length > 30) {
      setErrors((prev) => ({ ...prev, skill: "Keep each skill under 30 characters." }));
      return;
    }
    if (skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
      setErrors((prev) => ({ ...prev, skill: `${value} is already selected.` }));
      return;
    }
    if (skills.length >= MAX_SKILLS) {
      setErrors((prev) => ({ ...prev, skill: `You can choose up to ${MAX_SKILLS} skills. Remove one to add another.` }));
      return;
    }
    setSkills((prev) => [...prev, value]);
    setCustomSkill("");
    setErrors((prev) => ({ ...prev, skill: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Enter on an earlier step means "Continue", not "submit"
    if (step < STEPS.length - 1) {
      handleContinue();
      return;
    }

    // Re-check everything before sending
    for (let i = 0; i < STEPS.length - 1; i++) {
      const found = validateStep(i, formData);
      if (Object.keys(found).length > 0) {
        goTo(i);
        setErrors(found);
        return;
      }
    }

    setLoading(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/tid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, skills }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "We couldn't create your TID. Please try again.");

      router.push(`/tid/${data.developer.tid}?${data.existing ? "existing" : "new"}=true`);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "We couldn't create your TID. Please try again.");
      setLoading(false);
    }
  };

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <main className="min-h-screen bg-bg-primary pb-20 pt-28">
      <div className="mx-auto grid max-w-[1140px] grid-cols-1 gap-10 px-5 md:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        {/* Intro: first on every screen size */}
        <header className="lg:col-start-1 lg:row-start-1">
          <div className="eyebrow mb-4 flex items-center gap-2">
            <Fingerprint className="h-3.5 w-3.5" />
            Developer Registry
          </div>
          <h1 className="mb-4 text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-text-primary md:text-4xl lg:text-5xl">
            Mint Your <span className="text-accent-blue-light">Developer Passport</span>
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-text-secondary md:text-base">
            Your permanent developer identity in the African tech ecosystem, with a public page anyone can check. Preview your card in real time as you complete your profile.
          </p>
        </header>

        {/* Wizard */}
        <section
          aria-label="Claim your TID"
          className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start"
        >
          <form onSubmit={handleSubmit} noValidate className="rounded-xl border border-border-glass bg-bg-card">
            <div className="border-b border-border-glass px-5 py-4 md:px-7">
              <Stepper steps={STEPS} current={step} maxReached={maxReached} onSelect={goTo} />
            </div>

            <div className="px-5 py-6 md:px-7 md:py-8">
              <p className="mb-1 hidden text-xs font-medium text-text-muted sm:block">
                Step {step + 1} of {STEPS.length}
              </p>
              <h2 ref={headingRef} tabIndex={-1} className="text-xl font-bold tracking-tight text-text-primary outline-none md:text-2xl">
                {current.title}
              </h2>
              <p className="mb-6 mt-1 text-sm text-text-secondary">{current.description}</p>

              {/* Step 1: About you */}
              {step === 0 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <label htmlFor="fullName" className={labelClass}>Full name</label>
                    <Input
                      id="fullName"
                      autoComplete="name"
                      placeholder="e.g. Chinua Achebe"
                      value={formData.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? "fullName-error" : undefined}
                      className="h-11"
                    />
                    {errors.fullName && <p id="fullName-error" className={fieldErrorClass}>{errors.fullName}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>Email address</label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => update("email", e.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : "email-hint"}
                      className="h-11"
                    />
                    {errors.email ? (
                      <p id="email-error" className={fieldErrorClass}>{errors.email}</p>
                    ) : (
                      <p id="email-hint" className="mt-1.5 text-xs text-text-muted">
                        Already have a TID? Use the same email to open your existing passport.
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="country" className={labelClass}>
                      Country <span className="font-normal text-text-muted">(optional)</span>
                    </label>
                    <Input
                      id="country"
                      autoComplete="country-name"
                      list="country-suggestions"
                      placeholder="e.g. Ghana, Kenya, Nigeria"
                      value={formData.country}
                      onChange={(e) => update("country", e.target.value)}
                      className="h-11"
                    />
                    <datalist id="country-suggestions">
                      {COUNTRY_SUGGESTIONS.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                </div>
              )}

              {/* Step 2: Role */}
              {step === 1 && (
                <div className="flex flex-col gap-6">
                  <fieldset aria-describedby={errors.role ? "role-error" : undefined}>
                    <legend className={labelClass}>Primary role</legend>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {ROLES.map((role, i) => {
                        const selected = formData.role === role;
                        return (
                          <label
                            key={role}
                            className={cn(
                              "flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-3.5 py-3 text-sm transition-colors",
                              "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-blue/50",
                              selected
                                ? "border-accent-blue bg-accent-blue-glow-soft font-medium text-text-primary"
                                : "border-border-glass text-text-secondary hover:border-border-glass-hover hover:text-text-primary"
                            )}
                          >
                            <input
                              id={`role-${i}`}
                              type="radio"
                              name="role"
                              value={role}
                              checked={selected}
                              onChange={() => update("role", role)}
                              className="sr-only"
                            />
                            {role}
                            <span
                              className={cn(
                                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                                selected ? "border-accent-blue bg-accent-blue text-white" : "border-border-glass-hover"
                              )}
                              aria-hidden="true"
                            >
                              {selected && <Check size={10} strokeWidth={3} />}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.role && <p id="role-error" className={fieldErrorClass}>{errors.role}</p>}
                  </fieldset>

                  <div>
                    <label htmlFor="githubUrl" className={labelClass}>
                      GitHub or portfolio <span className="font-normal text-text-muted">(optional)</span>
                    </label>
                    <Input
                      id="githubUrl"
                      autoComplete="url"
                      placeholder="github.com/yourhandle"
                      value={formData.githubUrl}
                      onChange={(e) => update("githubUrl", e.target.value)}
                      aria-invalid={Boolean(errors.githubUrl)}
                      aria-describedby={errors.githubUrl ? "githubUrl-error" : undefined}
                      className="h-11"
                    />
                    {errors.githubUrl && <p id="githubUrl-error" className={fieldErrorClass}>{errors.githubUrl}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Skills */}
              {step === 2 && (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">Suggested skills</span>
                    <span className="text-xs tabular-nums text-text-muted" aria-live="polite">
                      {skills.length} of {MAX_SKILLS} selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_SKILLS.map((skill) => {
                      const selected = skills.includes(skill);
                      const full = !selected && skills.length >= MAX_SKILLS;
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          aria-pressed={selected}
                          disabled={full}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                            selected
                              ? "border-accent-blue bg-accent-blue text-white"
                              : "border-border-glass text-text-secondary hover:border-border-glass-hover hover:text-text-primary",
                            full && "cursor-not-allowed opacity-40 hover:border-border-glass hover:text-text-secondary"
                          )}
                        >
                          {selected && <Check size={12} aria-hidden="true" />}
                          {skill}
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <label htmlFor="skill" className={labelClass}>Add another skill</label>
                    <div className="flex gap-2">
                      <Input
                        id="skill"
                        placeholder="e.g. Kotlin, Figma, Solidity"
                        value={customSkill}
                        onChange={(e) => {
                          setCustomSkill(e.target.value);
                          if (errors.skill) setErrors((prev) => ({ ...prev, skill: undefined }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomSkill();
                          }
                        }}
                        aria-invalid={Boolean(errors.skill)}
                        aria-describedby={errors.skill ? "skill-error" : undefined}
                        className="h-11"
                      />
                      <Button type="button" variant="outline" className="h-11 shrink-0 px-4" onClick={addCustomSkill}>
                        <Plus size={16} />
                        Add
                      </Button>
                    </div>
                    {errors.skill && <p id="skill-error" className={fieldErrorClass}>{errors.skill}</p>}
                  </div>

                  {skills.some((s) => !COMMON_SKILLS.includes(s)) && (
                    <div className="flex flex-wrap gap-2">
                      {skills
                        .filter((s) => !COMMON_SKILLS.includes(s))
                        .map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 rounded-full border border-accent-blue bg-accent-blue py-1.5 pl-3 pr-1.5 text-xs font-medium text-white"
                          >
                            {s}
                            <button
                              type="button"
                              onClick={() => toggleSkill(s)}
                              aria-label={`Remove ${s}`}
                              className="rounded-full p-0.5 hover:bg-white/20"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                    </div>
                  )}

                  <p className="text-xs text-text-muted">Skills are optional and you can skip this step.</p>
                </div>
              )}

              {/* Step 4: Review */}
              {step === 3 && (
                <div className="flex flex-col gap-4">
                  {submitError && (
                    <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                      {submitError}
                    </div>
                  )}

                  {[
                    {
                      title: "About you",
                      step: 0,
                      rows: [
                        ["Full name", formData.fullName.trim()],
                        ["Email", formData.email.trim()],
                        ["Country", formData.country.trim() || "Not provided"],
                      ],
                    },
                    {
                      title: "Your role",
                      step: 1,
                      rows: [
                        ["Primary role", formData.role],
                        ["GitHub or portfolio", formData.githubUrl.trim() || "Not provided"],
                      ],
                    },
                  ].map((section) => (
                    <div key={section.title} className="rounded-lg border border-border-glass">
                      <div className="flex items-center justify-between border-b border-border-glass px-4 py-2.5">
                        <h3 className="text-sm font-semibold text-text-primary">{section.title}</h3>
                        <button
                          type="button"
                          onClick={() => goTo(section.step)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-accent-blue-light hover:underline"
                        >
                          <Pencil size={12} aria-hidden="true" />
                          Edit<span className="sr-only"> {section.title.toLowerCase()}</span>
                        </button>
                      </div>
                      <dl className="divide-y divide-border-glass">
                        {section.rows.map(([label, value]) => (
                          <div key={label} className="flex flex-col gap-0.5 px-4 py-2.5 sm:flex-row sm:gap-4">
                            <dt className="w-40 shrink-0 text-xs text-text-muted sm:text-sm">{label}</dt>
                            <dd className="min-w-0 break-words text-sm text-text-primary">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}

                  <div className="rounded-lg border border-border-glass">
                    <div className="flex items-center justify-between border-b border-border-glass px-4 py-2.5">
                      <h3 className="text-sm font-semibold text-text-primary">Your skills</h3>
                      <button
                        type="button"
                        onClick={() => goTo(2)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-accent-blue-light hover:underline"
                      >
                        <Pencil size={12} aria-hidden="true" />
                        Edit<span className="sr-only"> skills</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 px-4 py-3">
                      {skills.length > 0 ? (
                        skills.map((s) => (
                          <span key={s} className="rounded-full border border-border-glass px-2.5 py-1 text-xs text-text-secondary">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-text-muted">No skills selected</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg bg-bg-secondary px-4 py-3">
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-accent-blue" aria-hidden="true" />
                    <p className="text-xs leading-relaxed text-text-muted">
                      Once issued, your TID is permanently linked to your profile. Anyone can confirm it on your public Techfamz page or by scanning the QR code on your card. Your email is never shown publicly.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 border-t border-border-glass px-5 py-4 md:px-7">
              {step > 0 ? (
                <Button type="button" variant="outline" onClick={() => goTo(step - 1)} disabled={loading}>
                  <ArrowLeft size={16} />
                  Back
                </Button>
              ) : (
                <span className="text-xs text-text-muted">Takes about a minute</span>
              )}

              {isLast ? (
                <Button type="submit" variant="cta" disabled={loading} className="group">
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating your TID...
                    </>
                  ) : (
                    <>
                      Mint Your Developer Passport
                      <ArrowRight size={16} className="transition-transform duration-150 group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>
              ) : (
                <Button type="button" variant="cta" onClick={handleContinue} className="group">
                  {step === 2 && skills.length === 0 ? "Skip for now" : "Continue"}
                  <ArrowRight size={16} className="transition-transform duration-150 group-hover:translate-x-0.5" />
                </Button>
              )}
            </div>
          </form>
        </section>

        {/* Live preview + reassurance */}
        <aside className="lg:sticky lg:top-28 lg:col-start-1 lg:row-start-2 lg:self-start" aria-label="Passport preview">
          <PassportPreview fullName={formData.fullName} role={formData.role} country={formData.country} skills={skills} />

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border-glass bg-bg-card p-4">
              <Shield className="mb-1.5 h-5 w-5 text-accent-blue" aria-hidden="true" />
              <h4 className="mb-0.5 text-xs font-bold text-text-primary">Public Verification</h4>
              <p className="text-[11px] leading-relaxed text-text-muted">Anyone can confirm your TID on its public Techfamz page.</p>
            </div>
            <div className="rounded-lg border border-border-glass bg-bg-card p-4">
              <Lock className="mb-1.5 h-5 w-5 text-accent-blue" aria-hidden="true" />
              <h4 className="mb-0.5 text-xs font-bold text-text-primary">Private Email</h4>
              <p className="text-[11px] leading-relaxed text-text-muted">Your email is never shown on your public profile.</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
