import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import HLDeck from "@/components/HLDeck";
import SubscribeForm from "@/components/SubscribeForm";
import { alternatesFor, localeUrl } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aiPack" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor(locale, "/ai-pack"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: localeUrl(locale, "/ai-pack"),
      images: [{ url: "/og/ai-pack.jpg", width: 1200, height: 630 }],
    },
  };
}

const card =
  "flex flex-col gap-2 rounded-xl border border-black/[.08] bg-white p-6 dark:border-white/[.12] dark:bg-[#20242a]";
const h2 = "text-xl font-medium text-black dark:text-zinc-50";
const h3 = "font-medium text-black dark:text-zinc-50";
const p = "text-zinc-600 dark:text-zinc-300";
const link = "text-accent underline";

const NUMBERS = [
  ["number1", "/guides/ollama-open-webui-private-chatgpt"],
  ["number2", "/guides/comfyui-ai-images-at-home"],
  ["number3", "/guides/local-ai-coding-agent-ollama-aider-opencode"],
  ["number4", "/guides/gpu-passthrough-proxmox-lxc"],
] as const;

export default async function AiPackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("aiPack");

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-[#1a1a1a] font-sans">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16 sm:px-16">
        <div className="flex flex-col gap-3">
          <span className="self-start rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
            {t("badge")}
          </span>
          <h1 className="text-3xl tracking-tight text-black dark:text-zinc-50">
            <HLDeck /> {t("titleSuffix")}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">{t("lead")}</p>
          <SubscribeForm
            interest="ai-pack"
            buttonLabel={t("formButton")}
            placeholder={t("formPlaceholder")}
          />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("formText")}</p>
        </div>

        <section className="flex flex-col gap-2 rounded-xl border border-accent/30 bg-accent/5 p-6 dark:bg-accent/10">
          <h2 className={h2}>{t("statusTitle")}</h2>
          <p className={p}>{t("statusText")}</p>
        </section>

        <section className={card}>
          <h2 className={h2}>{t("planTitle")}</h2>
          <ul className="flex flex-col gap-4">
            {([1, 2, 3, 4] as const).map((n) => (
              <li key={n} className="flex flex-col gap-1">
                <h3 className={h3}>{t(`plan${n}Title`)}</h3>
                <p className={p}>{t(`plan${n}Text`)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={card}>
          <h2 className={h2}>{t("numbersTitle")}</h2>
          <p className={p}>{t("numbersText")}</p>
          <ul className="flex list-disc flex-col gap-2 pl-5">
            {NUMBERS.map(([key, href]) => (
              <li key={key} className={p}>
                {t(key)}{" "}
                <Link className={link} href={href}>
                  {t(`${key}Link`)}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={card}>
          <h2 className={h2}>{t("priceTitle")}</h2>
          <p className={p}>{t("priceText")}</p>
        </section>

        <section className={card}>
          <h2 className={h2}>{t("fitTitle")}</h2>
          <ul className="flex list-disc flex-col gap-2 pl-5">
            {(["fit1", "fit2", "fit3"] as const).map((key) => (
              <li key={key} className={p}>{t(key)}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
