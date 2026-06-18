import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getServerTranslations } from "@/lib/i18n/server";
import { AddToCartSection } from "@/components/add-to-cart-section";
import { AnimateIn } from "@/components/animate-in";
import { FloatingIngredientsWrapper } from "@/components/floating-ingredients-wrapper";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { t } = await getServerTranslations();

  const { data: product } = await supabase
    .from("products")
    .select("*, categories(name_en, slug)")
    .eq("slug", slug)
    .single();

  if (!product) {
    notFound();
  }

  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", product.category_id!)
    .neq("id", product.id)
    .limit(4);

  return (
    <div className="relative overflow-hidden">
      <FloatingIngredientsWrapper categorySlug={product.categories?.slug || "default"} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb */}
        <AnimateIn animation="fade-in">
          <nav className="flex items-center gap-1.5 text-sm text-muted mb-8">
            <Link href="/" className="hover:text-primary transition-colors">
              {t.nav.home}
            </Link>
            <span className="text-border">/</span>
            <Link href="/products" className="hover:text-primary transition-colors">
              {t.nav.products}
            </Link>
            {product.categories && (
              <>
                <span className="text-border">/</span>
                <Link
                  href={`/products?category=${product.categories.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {product.categories.name_en}
                </Link>
              </>
            )}
            <span className="text-border">/</span>
            <span className="text-foreground font-medium">{product.name_en}</span>
          </nav>
        </AnimateIn>

        <div className="grid gap-8 lg:gap-12 lg:grid-cols-2">
          {/* Image Gallery */}
          <AnimateIn animation="slide-in-left">
            <div className="sticky top-24">
              <div className="aspect-square rounded-3xl overflow-hidden border border-border bg-white dark:bg-zinc-900 shadow-sm">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name_en}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
                    <div className="text-center">
                      <span className="text-7xl block mb-4">🌾</span>
                      <span className="text-lg font-medium text-muted">{product.name_en}</span>
                    </div>
                  </div>
                )}
              </div>
              {/* Thumbnail row if multiple images */}
              {product.images && product.images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img: string, i: number) => (
                    <div key={i} className="h-20 w-20 shrink-0 rounded-xl overflow-hidden border-2 border-border hover:border-primary transition-colors cursor-pointer">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AnimateIn>

          {/* Product Info */}
          <AnimateIn animation="fade-in-up" delay={150}>
            <div className="lg:py-4">
              {product.categories && (
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {product.categories.name_en}
                </span>
              )}
              <h1 className="mt-2 font-serif text-3xl font-bold text-foreground sm:text-4xl">
                {product.name_en}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  ₹{product.price}
                </span>
                <span className="text-base text-muted">
                  / {product.unit}
                </span>
              </div>

              {/* Stock Status */}
              <div className="mt-4">
                {product.in_stock ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse"></span>
                    In Stock — Ready to ship
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-error/10 px-3 py-1 text-xs font-medium text-error">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description_en && (
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wider">Description</h3>
                  <p className="text-muted leading-relaxed whitespace-pre-line">
                    {product.description_en}
                  </p>
                </div>
              )}

              {/* Add to Cart */}
              <div className="mt-8 border-t border-border pt-8">
                <AddToCartSection
                  productId={product.id}
                  name={product.name_en}
                  price={product.price}
                  unit={product.unit}
                  inStock={product.in_stock}
                  image={product.images?.[0]}
                />
              </div>

              {/* Trust Badges */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { icon: "🌿", label: "100% Natural" },
                  { icon: "🚚", label: "Free Delivery" },
                  { icon: "🫙", label: "Freshly Packed" },
                ].map((badge) => (
                  <div key={badge.label} className="text-center p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <span className="text-xl block mb-1">{badge.icon}</span>
                    <span className="text-[10px] font-medium text-muted leading-tight block">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIn>
        </div>

        {/* Related Products - Horizontal Scroll */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-20">
            <AnimateIn>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    {t.product.related}
                  </h2>
                  <p className="text-sm text-muted mt-1">You might also like these</p>
                </div>
              </div>
            </AnimateIn>
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
              {relatedProducts.map((rp, i) => (
                <AnimateIn key={rp.id} delay={i * 80}>
                  <Link
                    href={`/products/${rp.slug}`}
                    className="group block w-64 shrink-0 rounded-2xl border border-border bg-white dark:bg-zinc-900 overflow-hidden card-hover snap-start"
                  >
                    <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
                      {rp.images && rp.images.length > 0 ? (
                        <img
                          src={rp.images[0]}
                          alt={rp.name_en}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">🌾</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {rp.name_en}
                      </h3>
                      <p className="mt-2 text-lg font-bold text-primary">
                        ₹{rp.price}
                        <span className="text-xs font-normal text-muted ml-1">/ {rp.unit}</span>
                      </p>
                    </div>
                  </Link>
                </AnimateIn>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
