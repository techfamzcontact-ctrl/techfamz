"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#040810] relative overflow-hidden">
      {/* BG glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#1e3a8a] opacity-[0.05] blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[400px] p-8 md:p-10 bg-[rgba(10,16,34,0.6)] backdrop-blur-xl border border-border-glass rounded-2xl relative z-10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
            <Image src="/logo.png" alt="Logo" width={24} height={24} className="opacity-90" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-text-primary mb-2">Admin Login</h1>
        <p className="text-center text-sm text-text-muted mb-8">Sign in to manage Techfamz</p>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-200 bg-red-900/30 border border-red-500/30 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-[rgba(0,0,0,0.3)] border border-border-glass rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue placeholder:text-text-muted/50 transition-all"
              placeholder="admin@techfamz.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[rgba(0,0,0,0.3)] border border-border-glass rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue placeholder:text-text-muted/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 px-4 bg-accent-blue text-white font-semibold rounded-lg text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_var(--color-accent-blue-glow-soft)]"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
