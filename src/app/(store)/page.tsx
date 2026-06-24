import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getServerTranslations } from "@/lib/i18n/server";
import { AnimateIn } from "@/components/animate-in";

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const { t } = await getServerTranslations();

  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*, categories(name_en)")
    .eq("is_featured", true)
    .limit(4);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#f8f6f0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="max-w-3xl">
            <AnimateIn animation="fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f5e9] px-4 py-1.5 mb-8">
                <svg className="h-3.5 w-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                <span className="text-xs font-semibold text-primary tracking-wider uppercase">100% Natural · Freshly Milled</span>
              </div>
            </AnimateIn>

            <AnimateIn animation="fade-in-up" delay={100}>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                <span className="text-foreground">Home of </span>
                <span className="text-gradient">Healthy</span>
                <br />
                <span className="text-gradient">Grains,</span>
                <br />
                <span className="text-foreground">Global Flavour.</span>
              </h1>
            </AnimateIn>

            <AnimateIn animation="fade-in-up" delay={200}>
              <p className="mt-8 max-w-xl text-lg text-muted leading-relaxed">
                Madhur Life was born from the idea of bringing people back to nature
                — where food is medicine and grains are the treasure of health.
                Wholesome goodness in every pack.
              </p>
            </AnimateIn>

            <AnimateIn animation="fade-in-up" delay={300}>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/products"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-105 transition-all duration-200"
                >
                  Shop Pure. Live Better.
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/our-story"
                  className="inline-flex h-14 items-center justify-center rounded-full border-2 border-foreground/20 px-8 text-sm font-semibold text-foreground hover:border-foreground/40 hover:bg-foreground/5 transition-all duration-200"
                >
                  Our Story
                </Link>
              </div>
            </AnimateIn>

            <AnimateIn animation="fade-in-up" delay={400}>
              <div className="mt-14 flex flex-wrap items-center gap-8">
                {[
                  { icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: "No Additives" },
                  { icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>, label: "Premium Grains" },
                  { icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>, label: "Sourced with Care" },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2 text-sm text-muted">
                    <span className="text-primary">{badge.icon}</span>
                    <span className="font-medium">{badge.label}</span>
                  </div>
                ))}
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-y border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {[
              { title: "Freshly Milled", desc: "Daily from premium grains" },
              { title: "100% Natural", desc: "No additives, ever" },
              { title: "FSSAI Certified", desc: "Lic. 21225337001107" },
              { title: "Order Tracking", desc: "Sign in to track your order" },
            ].map((item) => (
              <div key={item.title} className="py-6 px-6 text-center">
                <p className="font-semibold text-foreground text-sm">{item.title}</p>
                <p className="mt-1 text-xs text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-16 sm:py-20 bg-[#f8f6f0]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimateIn>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-xs font-bold text-primary tracking-widest uppercase mb-2">Best Sellers</p>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                    Wholesome goodness in every pack
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  View all
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </AnimateIn>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product, i) => (
                <AnimateIn key={product.id} delay={i * 100}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="group block rounded-2xl border border-border bg-white overflow-hidden card-hover"
                  >
                    <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 relative">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name_en}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <img src="/brand/icon.jpeg" alt="Madur Life" className="w-20 h-20 rounded-2xl object-cover opacity-30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="p-4">
                      {product.categories && (
                        <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-1">
                          {product.categories.name_en}
                        </p>
                      )}
                      <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {product.name_en}
                      </h3>
                      <p className="mt-2 text-lg font-bold text-primary">
                        ₹{product.price}
                        <span className="text-xs font-normal text-muted ml-1">/ {product.unit}</span>
                      </p>
                    </div>
                  </Link>
                </AnimateIn>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
              >
                View all products
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Quality Promise Section */}
      <section className="py-20 sm:py-28 bg-primary">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn>
            <svg className="h-10 w-10 mx-auto mb-6 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Because quality is not an option — it&apos;s a promise.
            </h2>
            <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Just as the leaves protect and nourish, Madhur Life celebrates wholesome grains that have sustained generations. Handpicked ingredients. Unmatched standards.
            </p>
            <Link
              href="/products"
              className="mt-10 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-10 text-sm font-bold text-primary shadow-lg hover:bg-white/90 hover:scale-105 transition-all duration-200"
            >
              Bring Home the Goodness
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
