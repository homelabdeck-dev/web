"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

type Status = "idle" | "sending" | "success" | "invalid" | "error";

export default function SubscribeForm() {
  const t = useTranslations("home");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          website: data.get("website"),
          locale,
        }),
      });
      if (res.ok) {
        form.reset();
        setStatus("success");
      } else {
        setStatus(res.status === 400 ? "invalid" : "error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div id="subscribe" className="mt-6 flex w-full max-w-md scroll-mt-24 flex-col gap-3">
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          required
          placeholder={t("subscribePlaceholder")}
          aria-label={t("subscribePlaceholder")}
          className="h-12 w-full shrink-0 rounded-full sm:flex-1 border border-black/[.08] bg-white px-5 text-black placeholder:text-zinc-500 focus:border-accent focus:outline-none dark:border-white/[.12] dark:bg-[#20242a] dark:text-zinc-50 dark:placeholder:text-zinc-400"
        />
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="h-12 w-full rounded-full bg-accent sm:w-auto px-6 font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {t("subscribeButton")}
        </button>
      </form>
      <p role="status" aria-live="polite" className="min-h-6 text-sm text-zinc-600 dark:text-zinc-300">
        {status === "success" && t("subscribeSuccess")}
        {status === "invalid" && t("subscribeInvalid")}
        {status === "error" && t("subscribeError")}
      </p>
    </div>
  );
}
