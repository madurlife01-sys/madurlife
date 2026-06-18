"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Category {
  id: string;
  name_en: string;
  name_kn: string;
  slug: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [nameEn, setNameEn] = useState("");
  const [nameKn, setNameKn] = useState("");
  const [slug, setSlug] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const supabase = createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name_en");
    if (data) setCategories(data);
    setLoading(false);
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function handleSave() {
    if (!nameEn || !slug) return;
    const supabase = createClient();

    try {
      if (editingId) {
        const { error } = await supabase
          .from("categories")
          .update({ name_en: nameEn, name_kn: nameKn, slug })
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert({
          name_en: nameEn,
          name_kn: nameKn || nameEn,
          slug,
        });
        if (error) throw error;
      }

      setNameEn("");
      setNameKn("");
      setSlug("");
      setEditingId(null);
      loadCategories();
    } catch (err) {
      console.error("Failed to save category:", err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      loadCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  }

  function startEdit(cat: Category) {
    setNameEn(cat.name_en);
    setNameKn(cat.name_kn);
    setSlug(cat.slug);
    setEditingId(cat.id);
  }

  if (loading) return <p className="text-muted">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-foreground">Categories</h1>
      <p className="mt-1 text-sm text-muted">Organize your product categories</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="mt-6 flex flex-wrap items-end gap-3"
      >
        <div>
          <label className="text-xs font-medium text-muted">English</label>
          <input
            value={nameEn}
            onChange={(e) => {
              setNameEn(e.target.value);
              if (!editingId) setSlug(generateSlug(e.target.value));
            }}
            className="mt-1 flex h-9 w-40 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Flours"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">Kannada</label>
          <input
            value={nameKn}
            onChange={(e) => setNameKn(e.target.value)}
            className="mt-1 flex h-9 w-40 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="ಹಿಟ್ಟುಗಳು"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">Slug</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 flex h-9 w-40 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="flours"
          />
        </div>
        <button
          type="submit"
          className="flex h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setNameEn("");
              setNameKn("");
              setSlug("");
              setEditingId(null);
            }}
            className="flex h-9 items-center rounded-full border border-border px-4 text-sm font-medium text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="mt-6 space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
          >
            <div>
              <p className="font-medium text-card-foreground">{cat.name_en}</p>
              <p className="text-xs text-muted">
                {cat.name_kn} · {cat.slug}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => startEdit(cat)}
                className="text-xs text-muted hover:text-foreground transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-xs text-muted hover:text-error transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-muted text-center py-8">
            No categories yet
          </p>
        )}
      </div>
    </div>
  );
}
