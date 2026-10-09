import Image from "next/image";

/** Centered card used by the admin sign-in, forgot-password and reset-password pages. */
export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-primary px-4 py-10">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/logo.png" alt="Techfamz logo" width={44} height={44} className="mb-4 rounded-full" />
          <h1 className="text-xl font-bold tracking-tight text-text-primary">{title}</h1>
          {description && <p className="mt-1 text-sm text-text-muted">{description}</p>}
        </div>
        <div className="rounded-xl border border-border-glass bg-bg-card p-6">{children}</div>
        {footer && <div className="mt-6 text-center text-sm text-text-muted">{footer}</div>}
      </div>
    </main>
  );
}

export function AuthAlert({ tone, children }: { tone: "error" | "success"; children: React.ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={
        tone === "error"
          ? "mb-5 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400"
          : "mb-5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400"
      }
    >
      {children}
    </div>
  );
}
