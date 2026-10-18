"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export type PanelCategory = { slug: string; label: string; count: number };

export default function SidePanel({ categories }: { categories: PanelCategory[] }) {
  const t = useTranslations("panel");
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);
  const item =
    "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-accent/10 hover:text-accent dark:text-zinc-300";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("open")}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-700 transition-colors hover:text-accent dark:text-zinc-300"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-50 transition-[visibility] duration-200 ${open ? "" : "pointer-events-none invisible"}`}
        aria-hidden={!open}
      >
        <div
          onClick={close}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          role="dialog"
          aria-label={t("title")}
          className={`absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col gap-6 overflow-y-auto border-r border-black/[.08] bg-zinc-50 p-4 shadow-xl transition-transform duration-200 dark:border-white/[.12] dark:bg-[#1a1a1a] ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50">{t("title")}</span>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label={t("close")}
              tabIndex={open ? 0 : -1}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-700 hover:text-accent dark:text-zinc-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-1" onClick={close}>
            <Link href="/" className={item} tabIndex={open ? 0 : -1}>{t("home")}</Link>
            <Link href="/apps" className={item} tabIndex={open ? 0 : -1}>{t("apps")}</Link>
            <Link href="/guides" className={item} tabIndex={open ? 0 : -1}>{t("guides")}</Link>
            <Link href="/updates" className={item} tabIndex={open ? 0 : -1}>{t("updates")}</Link>
            <Link href="/#subscribe" className={item} tabIndex={open ? 0 : -1}>{t("newsletter")}</Link>
          </nav>

          <div className="flex flex-col gap-1">
            <p className="px-3 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{t("categories")}</p>
            <nav className="flex flex-col gap-1" onClick={close}>
              {categories.map((c) => (
                <Link key={c.slug} href={`/apps?category=${c.slug}`} className={item} tabIndex={open ? 0 : -1}>
                  <span>{c.label}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">{c.count}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </>
  );
}
