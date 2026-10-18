const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const key = process.env.BUTTONDOWN_API_KEY;
  if (!key) {
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

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  const locale = body.locale === "bg" ? "bg" : "en";

  const res = await fetch("https://api.buttondown.com/v1/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Token ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: email,
      tags: [`lang-${locale}`],
      referrer_url: "https://www.homelabdeck.dev",
    }),
  });

  if (res.ok) return Response.json({ ok: true });

  const data = await res.json().catch(() => ({}));
  if (data?.code === "email_already_exists") {
    return Response.json({ ok: true });
  }
  if (res.status === 400) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  return Response.json({ error: "unavailable" }, { status: 502 });
}
