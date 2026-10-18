import Redis from "ioredis";
import { randomBytes } from "node:crypto";

export const SITE = "https://www.homelabdeck.dev";
const FROM = process.env.NEWSLETTER_FROM ?? "HomelabDeck <news@homelabdeck.dev>";

export type Subscriber = {
  email: string;
  locale: "en" | "bg";
  status: "pending" | "confirmed";
  token: string;
  createdAt: string;
};

let client: Redis | null = null;

export function redis() {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  client ??= new Redis(url, { maxRetriesPerRequest: 2, connectTimeout: 5000 });
  return client;
}

export async function getJson<T>(db: Redis, key: string): Promise<T | null> {
  const raw = await db.get(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

export const newToken = () => randomBytes(24).toString("base64url");
export const subKey = (email: string) => `sub:${email}`;
export const tokKey = (token: string) => `tok:${token}`;

export function unsubscribeUrl(token: string) {
  return `${SITE}/api/unsubscribe?t=${encodeURIComponent(token)}`;
}

type Mail = { to: string; subject: string; html: string; text: string; token?: string };

export async function sendMail({ to, subject, html, text, token }: Mail) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY missing");
  const headers: Record<string, string> = {};
  if (token) {
    headers["List-Unsubscribe"] = `<${unsubscribeUrl(token)}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to, subject, html, text, headers }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}`);
}

export function confirmMail(locale: "en" | "bg", token: string) {
  const link = `${SITE}/api/subscribe/confirm?t=${encodeURIComponent(token)}`;
  const bg = locale === "bg";
  const subject = bg ? "Потвърди абонамента си за HomelabDeck" : "Confirm your HomelabDeck subscription";
  const intro = bg
    ? "Получаваш това писмо, защото някой е въвел този имейл за бюлетина на HomelabDeck."
    : "You are receiving this because this email address was entered for the HomelabDeck newsletter.";
  const cta = bg ? "Потвърди абонамента" : "Confirm subscription";
  const ignore = bg ? "Ако не си ти, просто игнорирай писмото и няма да получаваш нищо." : "If this was not you, ignore this email and nothing will be sent.";
  const html = `<div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#111"><h2 style="margin:0 0 16px">HomelabDeck</h2><p>${intro}</p><p style="margin:24px 0"><a href="${link}" style="background:#f97316;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:500">${cta}</a></p><p style="color:#666;font-size:14px">${ignore}</p></div>`;
  const text = `${intro}\n\n${cta}: ${link}\n\n${ignore}`;
  return { subject, html, text };
}

export function pageRedirect(locale: string, status: "confirmed" | "unsubscribed" | "invalid") {
  return Response.redirect(`${SITE}/${locale === "bg" ? "bg" : "en"}/newsletter/${status}`, 303);
}

export type Issue = {
  id: string;
  sendAt: string; // YYYY-MM-DD, sent by the daily cron on or after this date
  minSubscribers?: number; // hold the issue until the list is at least this big
  subjectEn: string;
  subjectBg: string;
  bodyEn: string;
  bodyBg: string;
};

const DAILY_LIMIT = 80; // Resend free plan: 100/day, leave room for confirmation emails

/** Sends due issues to confirmed subscribers who have not got them yet. Returns a log. */
export async function sendDueIssues(issues: Issue[], today: string) {
  const db = redis();
  const key = process.env.RESEND_API_KEY;
  if (!db || !key) throw new Error("not configured");
  const log: string[] = [];
  let quota = DAILY_LIMIT;

  for (const issue of [...issues].sort((a, b) => a.sendAt.localeCompare(b.sendAt))) {
    if (issue.sendAt > today || quota <= 0) continue;
    const sentKey = `sent:${issue.id}`;
    const emails = await db.smembers("subscribers");
    if (issue.minSubscribers && emails.length < issue.minSubscribers) {
      log.push(`${issue.id}: held (${emails.length}/${issue.minSubscribers} subscribers)`);
      continue;
    }

    const todo: Subscriber[] = [];
    for (const email of emails) {
      if (await db.sismember(sentKey, email)) continue;
      const sub = await getJson<Subscriber>(db, subKey(email));
      if (sub?.status === "confirmed") todo.push(sub);
    }
    const batch = todo.slice(0, quota);
    for (let i = 0; i < batch.length; i += 100) {
      const chunk = batch.slice(i, i + 100);
      const messages = chunk.map((s) => {
        const bg = s.locale === "bg";
        const unsub = unsubscribeUrl(s.token);
        const footer = `<p style="font-size:12px;color:#666;margin:32px auto 0;max-width:560px;padding:0 24px"><a href="${unsub}">${bg ? "Отписване" : "Unsubscribe"}</a></p>`;
        return {
          from: FROM,
          to: s.email,
          subject: bg ? issue.subjectBg : issue.subjectEn,
          html: (bg ? issue.bodyBg : issue.bodyEn) + footer,
          headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
        };
      });
      const res = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify(messages),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}`);
      await db.sadd(sentKey, ...chunk.map((s) => s.email));
    }
    quota -= batch.length;
    log.push(`${issue.id}: sent ${batch.length}, remaining ${todo.length - batch.length}`);
  }
  return log;
}
