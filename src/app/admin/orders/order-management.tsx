"use client";

import { useState, Fragment } from "react";
import { createClient } from "@/lib/supabase/client";

interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  delivery_name: string;
  delivery_phone: string;
  delivery_address: string;
  delivery_pincode: string;
  total: number;
  status: string;
  notes: string | null;
  created_at: string;
  items: any;
}

const statuses = ["pending", "confirmed", "delivered", "cancelled"];

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const statusDots: Record<string, string> = {
  pending: "bg-amber-400",
  confirmed: "bg-blue-400",
  delivered: "bg-emerald-400",
  cancelled: "bg-red-400",
};

export default function OrderManagement({
  orders: initialOrders,
}: {
  orders: Order[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdating(orderId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);
      if (error) throw error;
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="mt-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", ...statuses].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-semibold transition-all capitalize ${
              filter === s
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "bg-white dark:bg-zinc-800 text-foreground border border-border hover:border-primary/30 hover:bg-primary/5"
            }`}
          >
            {s === "all" && (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
              </svg>
            )}
            {s}
            {s === "pending" && (
              <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
            )}
          </button>
        ))}
      </div>

      {/* Orders Table */}
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
                <th className="px-5 py-3.5 font-medium text-muted text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <Fragment key={order.id}>
                  <tr
                    className="border-b border-border last:border-0 hover:bg-muted/10 cursor-pointer transition-colors"
                    onClick={() =>
                      setExpandedId(expandedId === order.id ? null : order.id)
                    }
                  >
                    <td className="px-5 py-4 font-mono text-xs font-medium text-primary">
                      {order.order_number}
                    </td>
                    <td className="px-5 py-4 font-medium text-foreground">
                      {order.delivery_name}
                    </td>
                    <td className="px-5 py-4 font-semibold text-foreground">
                      ₹{order.total.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColors[order.status]}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusDots[order.status]}`} />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted text-sm">
                      {new Date(order.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className="h-9 rounded-xl border border-border bg-white dark:bg-zinc-800 px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s} className="capitalize">
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {expandedId === order.id && (
                    <tr key={`${order.id}-detail`}>
                      <td colSpan={6} className="bg-muted/5 border-b border-border">
                        <div className="p-6 grid gap-3 text-sm animate-slide-down">
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div>
                              <p className="text-xs text-muted mb-1">Phone</p>
                              <p className="font-medium text-foreground">{order.delivery_phone}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted mb-1">Pincode</p>
                              <p className="font-medium text-foreground">{order.delivery_pincode}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-muted mb-1">Address</p>
                              <p className="font-medium text-foreground">{order.delivery_address}</p>
                            </div>
                          </div>
                          {order.notes && (
                            <div>
                              <p className="text-xs text-muted mb-1">Notes</p>
                              <p className="text-foreground">{order.notes}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-muted mb-2">Items</p>
                            <div className="rounded-xl bg-white dark:bg-zinc-800 border border-border p-3">
                              <pre className="text-xs text-foreground font-mono whitespace-pre-wrap">
                                {JSON.stringify(order.items, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-20 text-center text-muted">
                    <span className="text-3xl block mb-3">📦</span>
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
