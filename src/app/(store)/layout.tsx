import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PageTransitionWrapper } from "@/components/page-transition-wrapper";
import StoreHeader from "@/components/store-header";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  let isAdmin = false;
  if (user) {
    const supabase = await createServerSupabaseClient();
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <StoreHeader isAdmin={isAdmin} />

      <PageTransitionWrapper>
        <main className="flex-1">{children}</main>
      </PageTransitionWrapper>

      <footer className="border-t border-border bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12">
            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-600 text-sm font-bold text-white">
                    🌾
                  </span>
                  <span className="text-lg font-bold font-serif text-foreground">
                    Madur<span className="text-primary">Life</span>
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Premium organic flour, grains & spices from the heart of Karnataka.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Quick Links</h4>
                <div className="space-y-2">
                  <Link href="/products" className="block text-sm text-muted hover:text-primary transition-colors">Products</Link>
                  <Link href="/my-orders" className="block text-sm text-muted hover:text-primary transition-colors">My Orders</Link>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Contact</h4>
                <div className="space-y-2 text-sm text-muted">
                  <p>Karnataka, India</p>
                  <p>madurlife01@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-border py-6 text-center text-sm text-muted">
            &copy; {new Date().getFullYear()} Madur Life. All rights reserved. Crafted with care in Karnataka.
          </div>
        </div>
      </footer>
    </div>
  );
}
