import { pageRedirect, redis, subKey, tokKey, type Subscriber } from "@/lib/newsletter";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("t") ?? "";
  const db = redis();
  const email = db && token ? await db.get<string>(tokKey(token)) : null;
  const sub = db && email ? await db.get<Subscriber>(subKey(email)) : null;
  if (!db || !sub) return pageRedirect("en", "invalid");

  if (sub.status !== "confirmed") {
    await db.set(subKey(sub.email), { ...sub, status: "confirmed" });
  }
  await db.sadd("subscribers", sub.email);
  return pageRedirect(sub.locale, "confirmed");
}
