import { NextRequest, NextResponse } from "next/server";
import { selectTodaysPhrase } from "@/lib/phrases";
import { postToFacebook, formatPhraseForPost } from "@/lib/facebook";

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

  // On a fresh selection, post to Facebook. A posting failure is logged but
  // must never fail the cron — phrase rotation already succeeded above.
  let facebook: string | undefined;
  if (result.status === "selected") {
    const post = await postToFacebook(
      formatPhraseForPost(result.text, result.author)
    );
    facebook = post.status;
    if (post.status === "error") {
      console.error("[cron/daily] facebook post failed:", post.message);
    }
  }

  console.log("[cron/daily]", result.status, facebook ? `fb:${facebook}` : "");
  return NextResponse.json({ ...result, facebook });
}
