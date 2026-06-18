import { createServerSupabaseClient } from "@/lib/supabase/server";
import OrderManagement from "./order-management";

export default async function AdminOrdersPage() {
  const supabase = await createServerSupabaseClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground font-serif">Orders</h1>
        <p className="mt-1 text-sm text-muted">Manage customer orders</p>
      </div>
      <OrderManagement orders={orders || []} />
    </div>
  );
}
