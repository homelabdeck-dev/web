// Usage: node --env-file=.env.local scripts/send-newsletter.mjs <issue-id> "<subject>" <body.html> [--send] [--limit=90] [--locale=en|bg]
// Dry run by default. Skips addresses already sent for this issue, so re-run next day if over the daily cap.
import Redis from "ioredis";
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

const [issue, subject, file, ...flags] = process.argv.slice(2);
if (!issue || !subject || !file) {
  console.error("Usage: send-newsletter.mjs <issue-id> <subject> <body.html> [--send] [--limit=90]");
  process.exit(1);
}
const locale = (flags.find((f) => f.startsWith("--locale=")) ?? "").split("=")[1];
const send = flags.includes("--send");
const limit = Number((flags.find((f) => f.startsWith("--limit=")) ?? "--limit=90").split("=")[1]);
const SITE = "https://www.homelabdeck.dev";
const FROM = process.env.NEWSLETTER_FROM ?? "HomelabDeck <news@homelabdeck.dev>";

const db = new Redis(process.env.REDIS_URL);
const body = readFileSync(file, "utf8");

const emails = await db.smembers("subscribers");
const sentKey = `sent:${issue}`;
const todo = [];
for (const email of emails) {
  if (await db.sismember(sentKey, email)) continue;
  const raw = await db.get(`sub:${email}`);
  const sub = raw ? JSON.parse(raw) : null;
  if (sub?.status === "confirmed" && (!locale || sub.locale === locale)) todo.push(sub);
}
const batch = todo.slice(0, limit);
console.log(`${emails.length} subscribers, ${todo.length} not yet sent, sending ${batch.length}${send ? "" : " (DRY RUN)"}`);
if (!send) {
  db.disconnect();
  process.exit(0);
}

const messages = batch.map((s) => {
  const unsub = `${SITE}/api/unsubscribe?t=${encodeURIComponent(s.token)}`;
  const label = s.locale === "bg" ? "Отписване" : "Unsubscribe";
  return {
    from: FROM,
    to: s.email,
    subject,
    html: `${body}<p style="font-size:12px;color:#666;margin-top:32px"><a href="${unsub}">${label}</a></p>`,
    headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
  };
});
for (let i = 0; i < messages.length; i += 100) {
  const chunk = messages.slice(i, i + 100);
  const res = await fetch("https://api.resend.com/emails/batch", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `${issue}-${i}-${randomBytes(4).toString("hex")}` },
    body: JSON.stringify(chunk),
  });
  if (!res.ok) { console.error("Resend error", res.status, await res.text()); process.exit(1); }
  await db.sadd(sentKey, ...batch.slice(i, i + 100).map((s) => s.email));
}
console.log("done");
db.disconnect();
