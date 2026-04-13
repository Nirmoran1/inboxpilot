import { createAdminSupabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createAdminSupabase();
  const { count, error } = await supabase
    .from("action_log")
    .select("*", { count: "exact", head: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ count: count ?? 0 });
}
