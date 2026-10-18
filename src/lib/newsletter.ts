import { Redis } from "@upstash/redis";
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

export function redis() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
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
