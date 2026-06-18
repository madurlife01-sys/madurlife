"use client";

import { useState } from "react";
import { useClerk, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const clerk = useClerk();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const signIn = clerk.client!.signIn;
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await clerk.setActive({ session: result.createdSessionId });
        const adminEmails = ["madurlife01@gmail.com"];
        window.location.href = adminEmails.includes(email) ? "/admin" : "/";
      } else if (result.status === "needs_client_trust") {
        setError("Please disable Client Trust in Clerk dashboard: Dashboard → Attack Protection → Client Trust → OFF");
      } else {
        setError(`Sign-in incomplete (status: ${result.status}). Please try again.`);
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Sign-in failed. Please check your credentials.");
    }
    setSubmitting(false);
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (isSignedIn) return null;

  return (
    <div className="flex min-h-screen">
      {/* Left Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-emerald-700 to-emerald-900">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-0 h-60 w-60 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <span className="text-6xl mb-8 block">🌾</span>
          <h1 className="text-4xl font-bold font-serif leading-tight mb-4">
            Welcome back to<br />Madur<span className="text-emerald-200">Life</span>
          </h1>
          <p className="text-emerald-100/80 text-lg max-w-md leading-relaxed">
            Sign in to access your orders, manage your account, and continue shopping for premium organic products.
          </p>
          <div className="mt-12 flex items-center gap-4 text-sm text-emerald-200/60">
            <span>🌿 100% Organic</span>
            <span className="h-1 w-1 rounded-full bg-emerald-300/40" />
            <span>🚚 Free Delivery</span>
            <span className="h-1 w-1 rounded-full bg-emerald-300/40" />
            <span>📍 Karnataka</span>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-600 text-lg font-bold text-white shadow-md">
              🌾
            </span>
            <span className="text-xl font-bold font-serif text-foreground">
              Madur<span className="text-primary">Life</span>
            </span>
          </div>

          <h2 className="text-2xl font-bold text-foreground font-serif">
            Sign In
          </h2>
          <p className="mt-2 text-sm text-muted">
            Welcome back! Enter your credentials to continue.
          </p>

          {error && (
            <div className="mt-5 rounded-xl bg-error/5 border border-error/20 px-4 py-3 text-sm text-error flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="flex h-12 w-full rounded-xl border border-border bg-white dark:bg-zinc-900 px-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="flex h-12 w-full rounded-xl border border-border bg-white dark:bg-zinc-900 px-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary h-12 w-full justify-center mt-2"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
