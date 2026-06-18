import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-check";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const isAdmin = await requireAdmin();
  if (!isAdmin) redirect("/");

  const supabase = await createServerSupabaseClient();

  const { data: users } = await supabase
    .from("user_profiles")
    .select("*")
    .order("full_name", { ascending: true });

  const { data: orders } = await supabase
    .from("orders")
    .select("user_id, id, total, status, created_at")
    .order("created_at", { ascending: false });

  const orderCounts: Record<string, { count: number; total: number; latest: string }> = {};
  for (const o of orders || []) {
    const uid = o.user_id;
    if (!uid) continue;
    if (!orderCounts[uid]) {
      orderCounts[uid] = { count: 0, total: 0, latest: o.created_at };
    }
    orderCounts[uid].count++;
    orderCounts[uid].total += o.total;
    if (o.created_at > orderCounts[uid].latest) {
      orderCounts[uid].latest = o.created_at;
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Users</h1>
        <p className="mt-1 text-sm text-muted">{users?.length || 0} registered users</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left">
              <th className="px-4 py-3 font-medium text-muted">Name</th>
              <th className="px-4 py-3 font-medium text-muted">Phone</th>
              <th className="px-4 py-3 font-medium text-muted">Role</th>
              <th className="px-4 py-3 font-medium text-muted">Orders</th>
              <th className="px-4 py-3 font-medium text-muted">Total Spent</th>
              <th className="px-4 py-3 font-medium text-muted">Joined</th>
            </tr>
          </thead>
          <tbody>
            {(users || []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  No users found.
                </td>
              </tr>
            )}
            {(users || []).map((u) => {
              const stats = orderCounts[u.id] || { count: 0, total: 0 };
              return (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {u.full_name || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">{u.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.role === "admin"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{stats.count}</td>
                  <td className="px-4 py-3 text-muted">
                    {stats.total > 0 ? `₹${stats.total.toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(u.created_at).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
