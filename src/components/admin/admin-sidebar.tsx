"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/products", label: "Products", icon: "🌾" },
  { href: "/admin/categories", label: "Categories", icon: "🏷️" },
  { href: "/admin/users", label: "Users", icon: "👥" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-white/10 bg-zinc-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-500 text-sm font-bold shadow-lg shadow-primary/30">
          🌾
        </span>
        <div>
          <span className="text-sm font-bold font-serif tracking-tight">
            Madur<span className="text-emerald-400">Life</span>
          </span>
          <span className="block text-[10px] text-zinc-500 font-medium -mt-0.5">Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {nav.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {active && (
                <span className="absolute left-0 h-6 w-0.5 rounded-r-full bg-emerald-400" />
              )}
              <span className="text-base flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 p-4 space-y-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5">
          <UserButton
            appearance={{
              elements: { avatarBox: "h-8 w-8" },
            }}
          />
          <span className="text-xs text-zinc-400 truncate">Admin</span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          View Store
        </Link>
      </div>
    </aside>
  );
}
