import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";
import HLDeck from "@/components/HLDeck";

const COPY: Record<string, { title: ReactNode; text: ReactNode }> = {
  home: {
    title: "Skip the setup: one command, whole stack",
    text: (<><HLDeck /> is a free installer for a starter stack or a Jellyfin + Seerr + Sonarr + Radarr media stack behind a VPN kill switch. Plain Docker Compose, MIT licensed.</>),
  },
  starter: {
    title: "Prefer one command?",
    text: (<>The free <HLDeck /> installer sets this app up together with Homepage, Uptime Kuma, Portainer and Nginx Proxy Manager as plain Docker Compose.</>),
  },
  media: {
    title: "Prefer one command?",
    text: (<>The free <HLDeck /> installer sets up Jellyfin, Seerr, Sonarr, Radarr, Prowlarr and qBittorrent behind a VPN kill switch, and connects them for you.</>),
  },
} as const;

export type InstallerCtaVariant = "home" | "starter" | "media";

// slugs of catalog apps / guides that hldeck installs, mapped to the profile
export const INSTALLER_APPS: Record<string, InstallerCtaVariant> = {
  homepage: "starter",
  "uptime-kuma": "starter",
  portainer: "starter",
  "nginx-proxy-manager": "starter",
  jellyfin: "media",
};
export const INSTALLER_GUIDES: Record<string, InstallerCtaVariant> = {
  "jellyfin-sonarr-radarr-stack-proxmox-lxc": "media",
};

export default function InstallerCta({ variant }: { variant: InstallerCtaVariant }) {
  const c = COPY[variant];
  return (
    <aside className="flex flex-col gap-2 rounded-xl border border-accent/30 bg-accent/5 p-5 dark:bg-accent/10">
      <h2 className="text-lg font-medium text-black dark:text-zinc-50">{c.title}</h2>
      <p className="text-zinc-600 dark:text-zinc-300">{c.text}</p>
      <Link
        href="/installer"
        className="self-start text-sm font-medium text-accent transition-colors hover:text-accent-hover"
      >
        See the <HLDeck /> installer →
      </Link>
    </aside>
  );
}
