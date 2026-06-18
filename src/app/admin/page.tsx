import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient();

  const [
    ordersCount,
    productsCount,
    usersCount,
    { data: recentOrders },
    pendingResult,
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("user_profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id, order_number, delivery_name, total, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  const { data: revenueData } = await supabase
    .from("orders")
    .select("total")
    .in("status", ["confirmed", "delivered"]);

  const totalRevenue = revenueData?.reduce((sum, o) => sum + o.total, 0) || 0;

  const stats = [
    {
      label: "Total Orders",
      value: ordersCount.count || 0,
      href: "/admin/orders",
      icon: "📦",
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      href: "/admin/orders",
      icon: "💰",
      gradient: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Products",
      value: productsCount.count || 0,
      href: "/admin/products",
      icon: "🌾",
      gradient: "from-amber-500 to-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: "Users",
      value: usersCount.count || 0,
      href: "/admin/users",
      icon: "👥",
      gradient: "from-purple-500 to-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      label: "Pending Orders",
      value: pendingResult.count || 0,
      href: "/admin/orders",
      icon: "⏳",
      gradient: "from-orange-500 to-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950/30",
    },
  ];

  const statusColor: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground font-serif">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`group rounded-2xl p-5 ${s.bg} border border-border/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-white text-xs font-bold shadow-md shadow-black/10`}>
                →
              </span>
            </div>
            <p className="text-xs font-medium text-muted uppercase tracking-wider">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{s.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/products/new" className="group flex items-center gap-3 rounded-2xl border border-border bg-white dark:bg-zinc-900 p-5 card-hover">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">+</span>
          <div>
            <p className="font-medium text-foreground text-sm">Add Product</p>
            <p className="text-xs text-muted">Create new listing</p>
          </div>
        </Link>
        <Link href="/admin/orders" className="group flex items-center gap-3 rounded-2xl border border-border bg-white dark:bg-zinc-900 p-5 card-hover">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 text-lg">📋</span>
          <div>
            <p className="font-medium text-foreground text-sm">View Orders</p>
            <p className="text-xs text-muted">Manage all orders</p>
          </div>
        </Link>
        <Link href="/" className="group flex items-center gap-3 rounded-2xl border border-border bg-white dark:bg-zinc-900 p-5 card-hover">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-lg">🏪</span>
          <div>
            <p className="font-medium text-foreground text-sm">View Store</p>
            <p className="text-xs text-muted">Preview storefront</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground font-serif">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-left">
                  <th className="px-5 py-3.5 font-medium text-muted text-xs uppercase tracking-wider">Order</th>
                  <th className="px-5 py-3.5 font-medium text-muted text-xs uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3.5 font-medium text-muted text-xs uppercase tracking-wider">Total</th>
                  <th className="px-5 py-3.5 font-medium text-muted text-xs uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 font-medium text-muted text-xs uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {(!recentOrders || recentOrders.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-muted">
                      <span className="text-3xl block mb-3">📦</span>
                      No orders yet
                    </td>
                  </tr>
                )}
                {recentOrders?.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-5 py-4 font-mono text-xs font-medium text-primary">
                      {order.order_number}
                    </td>
                    <td className="px-5 py-4 text-foreground font-medium">
                      {order.delivery_name}
                    </td>
                    <td className="px-5 py-4 font-semibold text-foreground">
                      ₹{order.total.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                          statusColor[order.status] || "bg-muted text-muted"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted text-sm">
                      {new Date(order.created_at).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
