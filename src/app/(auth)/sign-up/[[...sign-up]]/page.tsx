"use client";

import { useState } from "react";
import { useClerk, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const clerk = useClerk();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const signUp = clerk.client!.signUp;
      await signUp.create({
        emailAddress: email,
        password,
        username: username || undefined,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const signUp = clerk.client!.signUp;
      await signUp.attemptEmailAddressVerification({ code });

      if (signUp.status === "complete" && signUp.createdSessionId) {
        await clerk.setActive({ session: signUp.createdSessionId });

        if (phone && clerk.user?.id) {
          const formattedPhone = phone.startsWith("+")
            ? phone
            : `+91${phone.replace(/^0+/, "")}`;
          const supabase = createClient();
          await supabase.from("user_profiles").upsert(
            { id: clerk.user.id, phone: formattedPhone },
            { onConflict: "id" }
          );
        }

        router.push("/");
        return;
      }

      const missing = signUp.missingFields?.map((f: any) => f.name || f).join(", ");
      setError(missing ? `Still missing: ${missing}` : "Additional fields required.");
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Verification failed. Please try again.");
    }
    setSubmitting(false);
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      await clerk.client!.signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Failed to resend code.");
    }
    setResending(false);
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (isSignedIn) return null;

  const isBusy = submitting || resending;

  return (
    <div className="flex min-h-screen">
      {/* Left Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-accent via-amber-800 to-amber-950">
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-0 h-60 w-60 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <span className="text-6xl mb-8 block">🌾</span>
          <h1 className="text-4xl font-bold font-serif leading-tight mb-4">
            Join the<br />Madur<span className="text-amber-200">Life</span> family
          </h1>
          <p className="text-amber-100/80 text-lg max-w-md leading-relaxed">
            Create your account to enjoy fast checkout, order tracking, and exclusive access to our premium organic products.
          </p>
          <div className="mt-12 flex items-center gap-4 text-sm text-amber-200/60">
            <span>🌿 100% Organic</span>
            <span className="h-1 w-1 rounded-full bg-amber-300/40" />
            <span>🚚 Free Delivery</span>
            <span className="h-1 w-1 rounded-full bg-amber-300/40" />
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
            {pendingVerification ? "Verify your email" : "Create an account"}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {pendingVerification
              ? "Enter the code sent to your email"
              : "Sign up to place orders faster"}
          </p>

          {error && (
            <div className="mt-5 rounded-xl bg-error/5 border border-error/20 px-4 py-3 text-sm text-error flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          {pendingVerification ? (
            <form onSubmit={handleVerify} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Verification Code</label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  className="flex h-12 w-full rounded-xl border border-border bg-white dark:bg-zinc-900 px-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-center text-lg tracking-[0.5em] font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={isBusy || code.length < 4}
                className="btn-primary h-12 w-full justify-center"
              >
                {submitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {resending ? "Resending..." : "Resend code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  autoComplete="username"
                  className="flex h-12 w-full rounded-xl border border-border bg-white dark:bg-zinc-900 px-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
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
                <label className="text-sm font-medium text-foreground mb-1.5 block">Phone <span className="text-muted font-normal">(optional)</span></label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9483205069"
                  autoComplete="tel"
                  className="flex h-12 w-full rounded-xl border border-border bg-white dark:bg-zinc-900 px-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="flex h-12 w-full rounded-xl border border-border bg-white dark:bg-zinc-900 px-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div id="clerk-captcha" />
              <button
                type="submit"
                disabled={isBusy}
                className="btn-primary h-12 w-full justify-center mt-2"
              >
                {submitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
