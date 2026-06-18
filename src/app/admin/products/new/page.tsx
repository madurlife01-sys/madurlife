"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageUploader from "@/components/admin/image-uploader";

interface Category {
  id: string;
  name_en: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name_en: "",
    name_kn: "",
    slug: "",
    description_en: "",
    description_kn: "",
    price: "",
    unit: "kg",
    category_id: "",
    is_featured: false,
    in_stock: true,
  });
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("categories").select("id, name_en").order("name_en").then(
      ({ data }) => { if (data) setCategories(data); }
    );
  }, []);

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase.from("products").insert({
      name_en: form.name_en,
      name_kn: form.name_kn || form.name_en,
      slug: form.slug || generateSlug(form.name_en),
      description_en: form.description_en || null,
      description_kn: form.description_kn || null,
      price: parseFloat(form.price),
      unit: form.unit,
      category_id: form.category_id || null,
      is_featured: form.is_featured,
      in_stock: form.in_stock,
      images: images.length > 0 ? images : null,
    });

    if (error) {
      alert("Error creating product: " + error.message);
    } else {
      router.push("/admin/products");
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-foreground">New Product</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <ImageUploader images={images} onChange={setImages} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground">
              Name (English)
            </label>
            <input
              value={form.name_en}
              onChange={(e) => setForm({ ...form, name_en: e.target.value })}
              className="mt-1 flex h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">
              Name (Kannada)
            </label>
            <input
              value={form.name_kn}
              onChange={(e) => setForm({ ...form, name_kn: e.target.value })}
              className="mt-1 flex h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Slug</label>
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="Auto-generated from name if empty"
            className="mt-1 flex h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-foreground">
              Price (₹)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="mt-1 flex h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Unit</label>
            <input
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="mt-1 flex h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="kg, 500g, piece"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="mt-1 flex h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name_en}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">
            Description (English)
          </label>
          <textarea
            rows={3}
            value={form.description_en}
            onChange={(e) => setForm({ ...form, description_en: e.target.value })}
            className="mt-1 flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">
            Description (Kannada)
          </label>
          <textarea
            rows={3}
            value={form.description_kn}
            onChange={(e) => setForm({ ...form, description_kn: e.target.value })}
            className="mt-1 flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              checked={form.in_stock}
              onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
              className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
            />
            In Stock
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 items-center rounded-full border border-border px-6 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex h-10 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
