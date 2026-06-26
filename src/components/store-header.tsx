"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserButton, useAuth } from "@clerk/nextjs";
import { LanguageToggle } from "@/components/language-toggle";
import { useCart } from "@/store/cart";
import { useLanguage } from "@/hooks/use-language";

interface StoreHeaderProps {
  isAdmin: boolean;
}

const navLinks = (t: any) => [
  { href: "/products", label: t.nav.products },
  { href: "/our-story", label: "Our Story" },
];

export default function StoreHeader({ isAdmin }: StoreHeaderProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { getItemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = getItemCount();
  const { isSignedIn } = useAuth();

  return (
    <>
      {/* Announcement Bar */}
      <div className="relative z-50 bg-[#1a6b3c] text-white">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4 text-xs font-medium tracking-wide sm:text-sm">
          Free delivery on orders above ₹500
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5 shrink-0">
            <img
              src="/brand/icon.jpeg"
              alt="Madur Life"
              className="h-9 w-9 rounded-xl object-cover shadow-sm transition-shadow group-hover:shadow-md"
            />
            <span className="text-xl font-bold tracking-tight text-gray-900 font-serif">
              Madur<span className="text-[#1a6b3c]">Life</span>
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
                      ? "text-[#1a6b3c] bg-[#1a6b3c]/5"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-[#1a6b3c]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <LanguageToggle />

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1a6b3c] px-1 text-[10px] font-bold text-white shadow-sm animate-scale-in">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            {/* Desktop: Signed In */}
            {isSignedIn && (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hidden sm:inline-flex h-9 items-center justify-center rounded-full bg-gray-100 px-4 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="hidden md:flex items-center gap-3 ml-1">
                  <Link
                    href="/my-orders"
                    className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
                      pathname === "/my-orders"
                        ? "text-[#1a6b3c] bg-[#1a6b3c]/5"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    My Orders
                  </Link>
                  <UserButton
                    userProfileMode="navigation"
                    userProfileUrl="/my-orders"
                  />
                </div>
              </>
            )}

            {/* Desktop: Signed Out */}
            {!isSignedIn && (
              <div className="hidden md:flex items-center gap-2 ml-1">
                <Link
                  href="/sign-in"
                  className="inline-flex h-9 items-center justify-center rounded-full border border-gray-300 px-5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex h-9 items-center justify-center rounded-full bg-[#1a6b3c] px-5 text-sm font-medium text-white hover:bg-[#155a30] transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 md:hidden"
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
          <div className="animate-slide-down border-t border-gray-200 bg-white md:hidden">
            <div className="space-y-1 px-4 py-4">
              {navLinks(t).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {isSignedIn && (
                <>
                  <Link
                    href="/my-orders"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-4 py-2.5 text-sm font-medium text-[#1a6b3c] hover:bg-[#1a6b3c]/5 transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <UserButton />
                  </div>
                </>
              )}

              {!isSignedIn && (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-4 py-2.5 text-sm font-medium text-[#1a6b3c] hover:bg-[#1a6b3c]/5 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
