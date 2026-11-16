import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

// catalog apps and guides the planned AI Pack covers
export const AI_PACK_APPS = ["ollama", "open-webui", "comfyui"];
export const AI_PACK_GUIDES = [
  "ollama-open-webui-private-chatgpt",
  "comfyui-ai-images-at-home",
  "gpu-passthrough-proxmox-lxc",
  "local-ai-coding-agent-ollama-aider-opencode",
];

export default async function AiPackCta() {
  const t = await getTranslations("aiPack");
  return (
    <aside className="flex flex-col gap-2 rounded-xl border border-accent/30 bg-accent/5 p-5 dark:bg-accent/10">
      <h2 className="text-lg font-medium text-black dark:text-zinc-50">{t("ctaTitle")}</h2>
      <p className="text-zinc-600 dark:text-zinc-300">{t("ctaText")}</p>
      <Link
        href="/ai-pack"
        className="self-start text-sm font-medium text-accent transition-colors hover:text-accent-hover"
      >
        {t("ctaLink")} →
      </Link>
    </aside>
  );
}
