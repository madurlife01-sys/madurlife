"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const statuses = ["pending", "confirmed", "delivered", "cancelled"];

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

interface Order {
  id: string;
  order_number: string;
  items: unknown;
  total: number;
  delivery_name: string;
  delivery_phone: string;
  delivery_address: string;
  delivery_pincode: string;
  notes: string | null;
  status: string;
  created_at: string;
}

export default function OrderDetailClient({ order: initialOrder }: { order: Order }) {
  const [order, setOrder] = useState(initialOrder);
  const [updating, setUpdating] = useState(false);

  async function updateStatus(newStatus: string) {
    setUpdating(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", order.id);
      if (error) throw error;
      setOrder((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  }

  const items: CartItem[] =
    typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/orders"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          &larr; Orders
        </Link>
      </div>

      <h1 className="mt-2 text-2xl font-semibold text-foreground">
        Order {order.order_number}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {new Date(order.created_at).toLocaleString("en-IN")}
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-medium text-muted">Status</h2>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-medium capitalize ${
                order.status === "pending"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : order.status === "confirmed"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  : order.status === "delivered"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {order.status}
            </span>
            <select
              value={order.status}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={updating}
              className="ml-auto h-8 rounded border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-medium text-muted">Total</h2>
          <p className="mt-1 text-xl font-semibold text-foreground">
            ₹{order.total}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-medium text-muted">Delivery Details</h2>
        <div className="mt-3 space-y-2 text-sm text-foreground">
          <p>
            <span className="text-muted">Name:</span> {order.delivery_name}
          </p>
          <p>
            <span className="text-muted">Phone:</span> {order.delivery_phone}
          </p>
          <p>
            <span className="text-muted">Address:</span>{" "}
            {order.delivery_address}, {order.delivery_pincode}
          </p>
          {order.notes && (
            <p>
              <span className="text-muted">Notes:</span> {order.notes}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-medium text-muted">Items</h2>
        <div className="mt-3 space-y-2">
          {items.map((item: CartItem, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-md bg-zinc-50 dark:bg-zinc-900/50 px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted">
                  {item.quantity} x ₹{item.price}/{item.unit}
                </p>
              </div>
              <p className="font-medium text-foreground">
                ₹{item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
