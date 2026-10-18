import { confirmMail, getJson, newToken, redis, sendMail, subKey, tokKey, type Subscriber } from "@/lib/newsletter";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const db = redis();
  if (!db || !process.env.RESEND_API_KEY) {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }

  let body: { email?: unknown; website?: unknown; locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  // Honeypot: real users leave this hidden field empty; bots fill it.
  if (typeof body.website === "string" && body.website.length > 0) {
    return Response.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  const locale = body.locale === "bg" ? "bg" : "en";

  // Rate limit per IP: 5 requests per hour.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const rlKey = `rl:${ip}`;
  const count = await db.incr(rlKey);
  if (count === 1) await db.expire(rlKey, 3600);
  if (count > 5) return Response.json({ error: "unavailable" }, { status: 429 });

  // Same response whether or not the address is already known (no enumeration).
  const existing = await getJson<Subscriber>(db, subKey(email));
  if (existing?.status === "confirmed") return Response.json({ ok: true });

  const token = existing?.token ?? newToken();
  const sub: Subscriber = {
    email,
    locale,
    status: "pending",
    token,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  await db.set(subKey(email), JSON.stringify(sub));
  await db.set(tokKey(token), email);

  try {
    await sendMail({ to: email, ...confirmMail(locale, token) });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
