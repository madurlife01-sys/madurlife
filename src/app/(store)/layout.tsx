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

      <footer className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-16">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {/* Brand */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-2.5 mb-5">
                  <img
                    src="/brand/icon.jpeg"
                    alt="Madur Life"
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                  <span className="text-xl font-bold font-serif">
                    Madur<span className="text-white/80">Life</span>
                  </span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed max-w-xs">
                  Home of healthy grains. Global flavour. Freshly milled, naturally processed, packed with love.
                </p>
              </div>

              {/* Shop */}
              <div>
                <h4 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-4">Shop</h4>
                <div className="space-y-3">
                  <Link href="/products" className="block text-sm text-white/70 hover:text-white transition-colors">All Products</Link>
                  <Link href="/products?category=flours" className="block text-sm text-white/70 hover:text-white transition-colors">Flours</Link>
                  <Link href="/products?category=ravas" className="block text-sm text-white/70 hover:text-white transition-colors">Ravas</Link>
                </div>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-4">Company</h4>
                <div className="space-y-3">
                  <Link href="/our-story" className="block text-sm text-white/70 hover:text-white transition-colors">Our Story</Link>
                  <Link href="/products" className="block text-sm text-white/70 hover:text-white transition-colors">Contact</Link>
                </div>
              </div>

              {/* Get in Touch */}
              <div>
                <h4 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-4">Get in Touch</h4>
                <div className="space-y-2 text-sm text-white/70">
                  <p>Akshatha Traders</p>
                  <p>Matter Thota, Harapanahalli,</p>
                  <p>Vijayanagar, Karnataka</p>
                  <p className="mt-3">FSSAI Lic. 21225337001107</p>
                  <a href="tel:+919483205069" className="inline-block mt-2 text-white font-semibold hover:text-white/80 transition-colors">
                    +91 94832 05069
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Madur Life · Akshatha Traders
            </p>
            <p className="text-xs text-white/40">
              Good Food · Good Health · Good Life
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
