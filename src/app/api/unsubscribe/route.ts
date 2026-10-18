import { pageRedirect, redis, subKey, tokKey, type Subscriber } from "@/lib/newsletter";

async function unsubscribe(request: Request) {
  const token = new URL(request.url).searchParams.get("t") ?? "";
  const db = redis();
  const email = db && token ? await db.get<string>(tokKey(token)) : null;
  const sub = db && email ? await db.get<Subscriber>(subKey(email)) : null;
  if (!db || !sub) return null;

  await db.srem("subscribers", sub.email);
  await db.del(subKey(sub.email), tokKey(token));
  return sub;
}

// Link in the email body.
export async function GET(request: Request) {
  const sub = await unsubscribe(request);
  return sub ? pageRedirect(sub.locale, "unsubscribed") : pageRedirect("en", "invalid");
}

// RFC 8058 one-click unsubscribe from mail clients.
export async function POST(request: Request) {
  const sub = await unsubscribe(request);
  return new Response(null, { status: sub ? 200 : 404 });
}
