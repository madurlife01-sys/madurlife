import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { type, data } = payload;

    if (type === "user.created" || type === "user.updated") {
      const clerkId = data.id;
      const fullName =
        data.first_name && data.last_name
          ? `${data.first_name} ${data.last_name}`
          : data.first_name || data.email_addresses?.[0]?.email_address || "";

      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.from("user_profiles").upsert(
        {
          id: clerkId,
          full_name: fullName,
          phone: data.phone_numbers?.[0]?.phone_number || null,
          role: "customer",
        },
        { onConflict: "id" }
      );

      if (error) {
        console.error("Failed to sync user profile:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
