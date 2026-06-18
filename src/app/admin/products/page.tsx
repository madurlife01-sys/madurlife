import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import ProductManagement from "./product-management";

export default async function AdminProductsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name_en), images")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-serif">Products</h1>
          <p className="mt-1 text-sm text-muted">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-primary h-10 text-sm"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </Link>
      </div>
      <ProductManagement products={products || []} />
    </div>
  );
}
