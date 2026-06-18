import { currentUser } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const OWNER_EMAILS = ["madurlife01@gmail.com"];

export async function requireAdmin() {
  const user = await currentUser();
  if (!user) return false;

  const supabase = await createServerSupabaseClient();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") return true;

  const email = user.emailAddresses?.[0]?.emailAddress;
  if (email && OWNER_EMAILS.includes(email)) {
    await supabase
      .from("user_profiles")
      .upsert(
        {
          id: user.id,
          full_name: user.firstName || user.username || "",
          phone: user.phoneNumbers?.[0]?.phoneNumber || "",
          role: "admin",
        },
        { onConflict: "id" }
      );
    return true;
  }

  return false;
}
