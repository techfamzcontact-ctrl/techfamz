"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else if (res?.ok) {
        window.location.href = "/admin";
      } else {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      {/* BG glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#1e3a8a] opacity-[0.05] blur-[100px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-[400px] border-border-glass backdrop-blur-xl relative z-10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]" style={{ backgroundColor: "var(--surface-dialog)" }}>
        <CardHeader className="pb-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full border border-border-glass bg-bg-card flex items-center justify-center">
              <Image src="/logo.png" alt="Logo" width={24} height={24} className="opacity-90" />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold text-center text-text-primary">Admin Login</CardTitle>
          <CardDescription className="text-center">Sign in to manage Techfamz</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-6 p-3 text-sm text-red-200 bg-red-900/30 border border-red-500/30 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-text-muted uppercase tracking-wider">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@techfamz.com"
                className="bg-bg-primary border-border-glass focus-visible:ring-accent-blue placeholder:text-text-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold text-text-muted uppercase tracking-wider">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-bg-primary border-border-glass focus-visible:ring-accent-blue placeholder:text-text-muted/50"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-6 bg-accent-blue text-white font-semibold shadow-[0_0_20px_var(--color-accent-blue-glow-soft)] hover:bg-blue-600 hover:shadow-[0_0_30px_var(--color-accent-blue-glow-soft)] transition-all"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
