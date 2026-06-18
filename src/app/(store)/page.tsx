import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GrainParticlesWrapper } from "@/components/grain-particles-wrapper";
import { getServerTranslations } from "@/lib/i18n/server";
import { AnimateIn } from "@/components/animate-in";

const categoryGradients = [
  "from-emerald-500/10 via-green-500/5 to-teal-500/10",
  "from-amber-500/10 via-yellow-500/5 to-orange-500/10",
  "from-rose-500/10 via-pink-500/5 to-red-500/10",
  "from-blue-500/10 via-indigo-500/5 to-violet-500/10",
  "from-orange-500/10 via-amber-500/5 to-yellow-500/10",
];

const categoryEmojis = ["🌾", "🌿", "🌶️", "📦", "🍃"];

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const { t } = await getServerTranslations();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name_en");

  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*, categories(name_en)")
    .eq("is_featured", true)
    .limit(4);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
        {/* Decorative Background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 20% 40%, rgba(26,122,74,0.10) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(245,200,66,0.08) 0%, transparent 50%), radial-gradient(ellipse at 60% 90%, rgba(139,94,60,0.06) 0%, transparent 50%), var(--background)",
          }}
        />
        <GrainParticlesWrapper />

        {/* Decorative Floating Elements */}
        <div className="absolute top-20 left-[10%] text-4xl opacity-20 animate-float select-none pointer-events-none" aria-hidden="true">🌾</div>
        <div className="absolute top-32 right-[12%] text-3xl opacity-15 animate-float-delayed select-none pointer-events-none" aria-hidden="true">🌿</div>
        <div className="absolute bottom-20 left-[20%] text-2xl opacity-15 animate-float select-none pointer-events-none" aria-hidden="true">🌶️</div>
        <div className="absolute bottom-32 right-[18%] text-3xl opacity-10 animate-float-delayed select-none pointer-events-none" aria-hidden="true">🍃</div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimateIn animation="fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-4 py-1.5 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow"></span>
              <span className="text-xs font-medium text-primary tracking-wide uppercase">From Karnataka, With Love</span>
            </div>
          </AnimateIn>

          <AnimateIn animation="fade-in-up" delay={100}>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
              {t.home.heroTitle.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="text-gradient">
                {t.home.heroTitle.split(" ").slice(-1)}
              </span>
            </h1>
          </AnimateIn>

          <AnimateIn animation="fade-in-up" delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted leading-relaxed">
              {t.home.heroSubtitle}
            </p>
          </AnimateIn>

          <AnimateIn animation="fade-in-up" delay={300}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products" className="btn-primary">
                {t.home.shopNow}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link href="/products" className="btn-secondary">
                View Products
              </Link>
            </div>
          </AnimateIn>

          {/* Trust Badges */}
          <AnimateIn animation="fade-in-up" delay={400}>
            <div className="mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              {[
                { icon: "✓", label: "100% Natural" },
                { icon: "🌱", label: "Farm Fresh" },
                { icon: "📍", label: "Made in Karnataka" },
                { icon: "🚚", label: "Free Delivery" },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-sm text-muted">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/8 text-primary text-xs font-bold">
                    {badge.icon}
                  </span>
                  <span className="font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimateIn>
              <div className="text-center mb-12">
                <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                  {t.home.categories}
                </h2>
                <p className="mt-3 text-muted">Explore our range of premium organic products</p>
              </div>
            </AnimateIn>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat, i) => (
                <AnimateIn key={cat.id} delay={i * 80}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="group block rounded-2xl p-6 sm:p-8 premium-card relative overflow-hidden border border-border bg-white dark:bg-zinc-900"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[i % categoryGradients.length]} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative z-10">
                      <span className="text-3xl mb-3 block">{categoryEmojis[i % categoryEmojis.length]}</span>
                      <h3 className="font-serif text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                        {cat.name_en}
                      </h3>
                      <p className="mt-1 text-sm text-muted">Explore collection →</p>
                    </div>
                  </Link>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-16 sm:py-20 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimateIn>
              <div className="text-center mb-12">
                <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                  {t.home.featured}
                </h2>
                <p className="mt-3 text-muted">Handpicked favorites our customers love</p>
              </div>
            </AnimateIn>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product, i) => (
                <AnimateIn key={product.id} delay={i * 100}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="group block rounded-2xl border border-border bg-white dark:bg-zinc-900 overflow-hidden card-hover"
                  >
                    <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 relative">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name_en}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted text-sm font-medium">
                          <div className="text-center">
                            <span className="text-4xl block mb-2">🌾</span>
                            {product.name_en}
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="p-4">
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
          </div>
        </section>
      )}

      {/* Why Madur Life */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                Why Madur Life?
              </h2>
              <p className="mt-3 text-muted">What makes our products different</p>
            </div>
          </AnimateIn>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🌿", title: "100% Organic", desc: "No chemicals, no preservatives. Just pure, natural ingredients." },
              { icon: "🏔️", title: "Karnataka Origin", desc: "Sourced directly from local farms across Karnataka." },
              { icon: "🫙", title: "Freshly Ground", desc: "Ground fresh on order to ensure maximum nutrition & taste." },
              { icon: "💚", title: "Fair Trade", desc: "Supporting local farmers with fair, sustainable pricing." },
            ].map((item, i) => (
              <AnimateIn key={item.title} delay={i * 100}>
                <div className="group rounded-2xl border border-border bg-white dark:bg-zinc-900 p-6 sm:p-8 card-hover text-center">
                  <span className="text-4xl block mb-4">{item.icon}</span>
                  <h3 className="font-serif text-lg font-semibold text-card-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-primary/[0.03] to-transparent">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn>
            <div className="rounded-3xl border border-border bg-white dark:bg-zinc-900 p-8 sm:p-12 shadow-sm">
              <div className="text-5xl mb-6">"</div>
              <p className="font-serif text-xl sm:text-2xl text-card-foreground leading-relaxed italic">
                The atta from Madur Life is the best I've ever used. My rotis are softer, fluffier, and taste incredible. You can truly feel the difference of freshly ground flour.
              </p>
              <div className="mt-8">
                <div className="flex items-center justify-center gap-1 text-secondary text-lg mb-2">
                  ★ ★ ★ ★ ★
                </div>
                <p className="font-medium text-card-foreground">A Happy Customer</p>
                <p className="text-sm text-muted">Karnataka</p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-emerald-700 to-primary p-8 sm:p-12 lg:p-16 text-center text-white">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-[10%] text-6xl">🌾</div>
                <div className="absolute bottom-4 right-[10%] text-5xl">🌿</div>
              </div>
              <div className="relative z-10">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
                  Ready to taste the difference?
                </h2>
                <p className="text-white/80 max-w-lg mx-auto mb-8">
                  Order now and experience the goodness of freshly ground, organic products delivered to your doorstep.
                </p>
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-primary shadow-lg hover:bg-white/90 hover:scale-105 transition-all duration-200"
                >
                  Shop Now
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
