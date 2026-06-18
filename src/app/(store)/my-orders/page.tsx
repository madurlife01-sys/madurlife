"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/hooks/use-language";
import { AnimateIn } from "@/components/animate-in";
import type { Database } from "@/types/database";

type Order = Database["public"]["Tables"]["orders"]["Row"];

const statusStyles: Record<string, { bg: string; dot: string; text: string }> = {
  pending: { bg: "bg-amber-50 border-amber-200", dot: "bg-amber-400", text: "text-amber-700 dark:text-amber-400" },
  confirmed: { bg: "bg-blue-50 border-blue-200", dot: "bg-blue-400", text: "text-blue-700 dark:text-blue-400" },
  delivered: { bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-400", text: "text-emerald-700 dark:text-emerald-400" },
  cancelled: { bg: "bg-red-50 border-red-200", dot: "bg-red-400", text: "text-red-700 dark:text-red-400" },
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusOrder = ["pending", "confirmed", "delivered"];

export default function MyOrdersPage() {
  const { t } = useLanguage();
  const { userId } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? []);
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <AnimateIn>
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            My Orders
          </h1>
          <p className="mt-1 text-sm text-muted">Track your order history</p>
        </div>
      </AnimateIn>

      {loading ? (
        <div className="mt-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-4" />
          <p className="text-sm text-muted">{t.common.loading}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-12 text-center py-16">
          <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-primary/5 border border-border">
            <svg className="h-14 w-14 text-muted/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-foreground mb-2">No orders yet</p>
          <p className="text-sm text-muted mb-6">Start shopping to see your orders here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const items = order.items as Array<{ name: string; quantity: number; price: number }>;
            const currentIdx = statusOrder.indexOf(order.status);
            return (
              <AnimateIn key={order.id} delay={i * 60}>
                <div className="rounded-2xl border border-border bg-white dark:bg-zinc-900 overflow-hidden card-hover">
                  {/* Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-border/50">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-semibold text-card-foreground font-mono text-sm">
                          {order.order_number}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                        statusStyles[order.status]?.bg ?? "bg-zinc-100 border-zinc-200"
                      } ${statusStyles[order.status]?.text ?? "text-zinc-800"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusStyles[order.status]?.dot ?? "bg-zinc-400"}`} />
                        {statusLabels[order.status] ?? order.status}
                      </span>
                      <p className="text-xl font-bold text-primary">
                        ₹{order.total.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  {order.status !== "cancelled" && (
                    <div className="px-5 py-4 bg-muted/10">
                      <div className="flex items-center max-w-md">
                        {statusOrder.map((s, si) => (
                          <div key={s} className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center">
                              <div className={`h-3 w-3 rounded-full transition-colors ${
                                si <= currentIdx ? "bg-primary" : "bg-border"
                              }`} />
                              <span className={`mt-1 text-[10px] font-medium ${si <= currentIdx ? "text-primary" : "text-muted"}`}>
                                {statusLabels[s]}
                              </span>
                            </div>
                            {si < statusOrder.length - 1 && (
                              <div className="flex-1 mx-2">
                                <div className="h-0.5 rounded-full bg-border overflow-hidden">
                                  <div className={`h-full bg-primary transition-all duration-500 ${
                                    si < currentIdx ? "w-full" : "w-0"
                                  }`} />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  {items && items.length > 0 && (
                    <div className="p-5">
                      <div className="space-y-2">
                        {items.map((item, j) => (
                          <div key={j} className="flex justify-between text-sm py-1">
                            <span className="text-muted">
                              {item.name} × {item.quantity}
                            </span>
                            <span className="text-foreground font-medium">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AnimateIn>
            );
          })}
        </div>
      )}
    </div>
  );
}
