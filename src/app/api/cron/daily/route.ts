import { NextRequest, NextResponse } from "next/server";
import { selectTodaysPhrase } from "@/lib/phrases";

// Vercel Cron calls this with GET + Authorization: Bearer <CRON_SECRET>
export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await selectTodaysPhrase();

  if (result.status === "error") {
    console.error("[cron/daily]", result.message);
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  console.log("[cron/daily]", result.status);
  return NextResponse.json(result);
}
