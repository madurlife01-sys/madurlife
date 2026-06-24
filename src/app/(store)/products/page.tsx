import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getServerTranslations } from "@/lib/i18n/server";
import { AnimateIn } from "@/components/animate-in";
import { ProductSearch } from "@/components/product-search";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const supabase = await createServerSupabaseClient();
  const params = await searchParams;
  const { t } = await getServerTranslations();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name_en");

  let query = supabase
    .from("products")
    .select("*, categories!inner(name_en, slug)");

  if (params.category) {
    query = query.eq("categories.slug", params.category);
  }

  if (params.q) {
    query = query.ilike("name_en", `%${params.q}%`);
  }

  const { data: products } = await query.order("created_at", {
    ascending: false,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <AnimateIn>
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {t.nav.products}
          </h1>
          <p className="mt-2 text-muted">Browse our collection of premium organic products</p>
        </div>
      </AnimateIn>

      {/* Search and Filters */}
      <AnimateIn delay={100}>
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-80">
            <ProductSearch />
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/products"
              className={`inline-flex h-10 items-center rounded-full px-5 text-sm font-medium transition-all duration-200 ${
                !params.category
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-white dark:bg-zinc-800 text-foreground border border-border hover:border-primary/30 hover:bg-primary/5"
              }`}
            >
              {t.common.all}
            </Link>
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}${params.q ? `&q=${params.q}` : ""}`}
                className={`inline-flex h-10 items-center rounded-full px-5 text-sm font-medium transition-all duration-200 ${
                  params.category === cat.slug
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-white dark:bg-zinc-800 text-foreground border border-border hover:border-primary/30 hover:bg-primary/5"
                }`}
              >
                {cat.name_en}
              </Link>
            ))}
          </div>
        </div>
      </AnimateIn>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products?.map((product, i) => (
          <AnimateIn key={product.id} delay={i * 60}>
            <Link
              href={`/products/${product.slug}`}
              className="group block rounded-2xl border border-border bg-white dark:bg-zinc-900 overflow-hidden card-hover"
            >
              <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name_en}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <img src="/brand/icon.jpeg" alt="Madur Life" className="w-16 h-16 rounded-xl object-cover opacity-30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-primary shadow-lg backdrop-blur-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    View Details
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="p-4">
                {product.categories && (
                  <span className="text-xs font-medium text-primary/70 uppercase tracking-wider">
                    {product.categories.name_en}
                  </span>
                )}
                <h3 className="mt-1 font-medium text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {product.name_en}
                </h3>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-lg font-bold text-primary">
                    ₹{product.price}
                    <span className="text-xs font-normal text-muted ml-1">/ {product.unit}</span>
                  </p>
                  {product.in_stock ? (
                    <span className="text-[10px] font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">In Stock</span>
                  ) : (
                    <span className="text-[10px] font-medium text-error bg-error/10 px-2 py-0.5 rounded-full">Out of Stock</span>
                  )}
                </div>
              </div>
            </Link>
          </AnimateIn>
        ))}
        {(!products || products.length === 0) && (
          <div className="col-span-full text-center py-20">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/5">
              <img src="/brand/icon.jpeg" alt="Madur Life" className="w-16 h-16 rounded-xl object-cover opacity-40" />
            </div>
            <p className="text-lg font-medium text-foreground mb-2">No products found</p>
            <p className="text-sm text-muted mb-6">{params.q ? `No results for "${params.q}"` : t.common.noResults}</p>
            <Link href="/products" className="btn-primary inline-flex">
              View All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
