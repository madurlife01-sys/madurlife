"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { LanguageToggle } from "@/components/language-toggle";
import { useCart } from "@/store/cart";
import { useLanguage } from "@/hooks/use-language";

interface StoreHeaderProps {
  isAdmin: boolean;
}

const navLinks = (t: any) => [
  { href: "/products", label: t.nav.products },
];

export default function StoreHeader({ isAdmin }: StoreHeaderProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { getItemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = getItemCount();

  return (
    <>
      {/* Announcement Bar */}
      <div className="relative z-50 bg-gradient-to-r from-primary via-primary to-emerald-700 text-primary-foreground">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4 text-xs font-medium tracking-wide sm:text-sm">
          <span className="mr-2 inline-block">🌾</span>
          Free delivery on orders above ₹500
          <span className="ml-2 inline-block">🌾</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/50 dark:bg-zinc-900/70 dark:border-white/5">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-600 text-base font-bold text-white shadow-md shadow-primary/20 transition-shadow group-hover:shadow-lg group-hover:shadow-primary/30">
              🌾
            </span>
            <span className="text-xl font-bold tracking-tight text-foreground font-serif">
              Madur<span className="text-primary">Life</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks(t).map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "?");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <LanguageToggle />

            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm animate-scale-in">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex h-9 items-center justify-center rounded-full bg-foreground/5 px-4 text-xs font-medium text-foreground hover:bg-foreground/10 transition-colors"
              >
                Dashboard
              </Link>
            )}

            <div className="hidden md:flex items-center gap-3 ml-1">
              <Link
                href="/my-orders"
                className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
                  pathname === "/my-orders"
                    ? "text-primary bg-primary/5"
                    : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                {t.nav.signIn === "Sign In" ? "My Orders" : "ನನ್ನ ಆರ್ಡರ್‌ಗಳು"}
              </Link>
              <UserButton />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground/70 hover:bg-foreground/5 md:hidden"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="animate-slide-down border-t border-border bg-white/90 backdrop-blur-xl dark:bg-zinc-900/90 md:hidden">
            <div className="space-y-1 px-4 py-4">
              {navLinks(t).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/my-orders"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-colors"
              >
                {t.nav.signIn === "Sign In" ? "My Orders" : "ನನ್ನ ಆರ್ಡರ್‌ಗಳು"}
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                >
                  Dashboard
                </Link>
              )}
              <div className="border-t border-border pt-3 mt-3 flex items-center gap-3">
                <UserButton />
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
