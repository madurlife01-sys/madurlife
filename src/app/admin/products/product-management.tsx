"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name_en: string;
  slug: string;
  price: number;
  unit: string;
  in_stock: boolean;
  is_featured: boolean;
  images: string[] | null;
  categories: { name_en: string } | null;
}

export default function ProductManagement({
  products: initialProducts,
}: {
  products: Product[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [editingImages, setEditingImages] = useState<string | null>(null);
  const [editImages, setEditImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const filtered = products.filter(
    (p) =>
      p.name_en.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  }

  async function toggleFeature(id: string, current: boolean) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("products")
        .update({ is_featured: !current })
        .eq("id", id);
      if (error) throw error;
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_featured: !current } : p))
      );
    } catch (err) {
      console.error("Failed to toggle featured:", err);
    }
  }

  async function toggleStock(id: string, current: boolean) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("products")
        .update({ in_stock: !current })
        .eq("id", id);
      if (error) throw error;
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, in_stock: !current } : p))
      );
    } catch (err) {
      console.error("Failed to toggle stock:", err);
    }
  }

  function startEditImages(product: Product) {
    setEditingImages(product.id);
    setEditImages(product.images || []);
  }

  async function uploadNewImages(files: FileList) {
    setUploading(true);
    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { contentType: file.type });

      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(data.path);
        uploaded.push(urlData.publicUrl);
      }
    }

    if (uploaded.length > 0) {
      setEditImages((prev) => [...prev, ...uploaded]);
    }
    setUploading(false);
  }

  async function saveImages() {
    if (!editingImages) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({ images: editImages })
      .eq("id", editingImages);
    if (!error) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingImages ? { ...p, images: editImages } : p
        )
      );
      setEditingImages(null);
    }
  }

  return (
    <div className="mt-6">
      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex h-11 w-full rounded-xl border border-border bg-white dark:bg-zinc-900 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-border bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-left">
                <th className="px-5 py-3.5 font-medium text-muted text-xs uppercase tracking-wider">Product</th>
                <th className="px-5 py-3.5 font-medium text-muted text-xs uppercase tracking-wider">Category</th>
                <th className="px-5 py-3.5 font-medium text-muted text-xs uppercase tracking-wider">Price</th>
                <th className="px-5 py-3.5 font-medium text-muted text-xs uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 font-medium text-muted text-xs uppercase tracking-wider">Stock</th>
                <th className="px-5 py-3.5 font-medium text-muted text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => startEditImages(product)}
                        className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border hover:ring-2 hover:ring-primary transition-all"
                        title="Edit images"
                      >
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name_en}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted/20 text-xs text-muted">
                            <span className="text-lg">🌾</span>
                          </div>
                        )}
                      </button>
                      <div>
                        <p className="font-medium text-foreground">{product.name_en}</p>
                        <p className="text-xs text-muted font-mono">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted text-sm">
                    {product.categories?.name_en || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-foreground">₹{product.price}</span>
                    <span className="text-xs text-muted ml-1">/{product.unit}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleFeature(product.id, product.is_featured)}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                        product.is_featured
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {product.is_featured ? "⭐ Featured" : "Regular"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleStock(product.id, product.in_stock)}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                        product.in_stock
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {product.in_stock ? "✓ In Stock" : "✗ Out"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-muted">
                    <span className="text-3xl block mb-3">🌾</span>
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Editor Modal */}
      {editingImages && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-2xl animate-scale-in border border-border">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-foreground">Edit Images</h3>
              <button
                onClick={() => setEditingImages(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-muted/20 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {editImages.map((url, i) => (
                <div key={i} className="relative h-24 w-24 overflow-hidden rounded-xl border border-border group">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    onClick={() => setEditImages((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
              <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border text-muted hover:border-primary hover:text-primary transition-colors">
                {uploading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  "+ Add"
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) uploadNewImages(e.target.files);
                  }}
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditingImages(null)}
                className="btn-secondary h-10 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveImages}
                className="btn-primary h-10 text-sm"
              >
                Save Images
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
