import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { INTERESTS, redis, sendDueIssues, waitKey, type Issue } from "@/lib/newsletter";

export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const dir = join(process.cwd(), "src/content/newsletter");
  const issues = readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")) as Issue);
  const today = new Date().toISOString().slice(0, 10);
  try {
    const log = await sendDueIssues(issues, today);
    // Daily counts in the runtime log (the production Redis URL cannot be pulled to a dev machine).
    const db = redis();
    if (db) {
      log.push(`subscribers: ${await db.scard("subscribers")}`);
      for (const i of INTERESTS) {
        log.push(`waitlist ${i}: ${await db.scard(waitKey(i))} confirmed, ${await db.scard(`${waitKey(i)}:requested`)} asked`);
      }
    }
    console.log(`newsletter cron: ${log.join("; ")}`);
    return Response.json({ log });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
