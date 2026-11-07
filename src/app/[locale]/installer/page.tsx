import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import HLDeck from "@/components/HLDeck";
import { alternatesFor, localeUrl } from "@/lib/seo";
import type { Metadata } from "next";

const TITLE = "HLDeck: one-command homelab installer";
const DESC =
  "Free, open installer that sets up a starter stack or a Jellyfin + Seerr + Sonarr + Radarr media stack behind a VPN kill switch, as plain Docker Compose.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLE,
    description: DESC,
    alternates: alternatesFor(locale, "/installer"),
    openGraph: {
      title: TITLE,
      description: DESC,
      url: localeUrl(locale, "/installer"),
      images: [{ url: "/og/installer.jpg", width: 1200, height: 630 }],
    },
  };
}

const card =
  "flex flex-col gap-2 rounded-xl border border-black/[.08] bg-white p-6 dark:border-white/[.12] dark:bg-[#20242a]";
const code =
  "overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100";
const h2 = "text-xl font-medium text-black dark:text-zinc-50";
const p = "text-zinc-600 dark:text-zinc-300";

export default async function InstallerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-[#1a1a1a] font-sans">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16 sm:px-16">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl tracking-tight text-black dark:text-zinc-50"><HLDeck /> installer</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            Free and open. It writes plain Docker Compose files, so you can leave at any time.
            Debian or Ubuntu, x86-64 or ARM64, at least 5 GB free.
          </p>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className={h2}>What you get</h2>
          <p className={p}>
            Real output from a clean Debian 13 container after installing both stacks, and the
            Homepage dashboard that the starter stack sets up with your services already listed.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/screenshots/installer/hldeck-status.webp"
            alt="Terminal output of the hldeck status command: nine services running across the starter and media stacks"
            width={1000}
            height={470}
            className="w-full rounded-xl border border-black/[.08] dark:border-white/[.12]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/screenshots/installer/homepage-dashboard.webp"
            alt="Homepage dashboard installed by HLDeck with Uptime Kuma, Portainer and Nginx Proxy Manager listed"
            width={1280}
            height={800}
            className="w-full rounded-xl border border-black/[.08] dark:border-white/[.12]"
          />
        </section>

        <section className={card}>
          <h2 className={h2}>Starter stack</h2>
          <p className={p}>Homepage, Uptime Kuma, Portainer and Nginx Proxy Manager.</p>
          <pre className={code}><code>curl -fsSL https://homelabdeck.dev/install.sh | sudo bash -s -- starter</code></pre>
        </section>

        <section className={card}>
          <h2 className={h2}>Media stack</h2>
          <p className={p}>
            Jellyfin, Seerr, Sonarr, Radarr, Prowlarr and qBittorrent. qBittorrent runs behind
            gluetun (WireGuard) with a kill switch: if the VPN drops, its traffic stops. Without a
            VPN key the installer starts everything except qBittorrent and tells you where to add it.
          </p>
          <pre className={code}><code>curl -fsSL https://homelabdeck.dev/install.sh | sudo bash -s -- media --vpn-provider mullvad --vpn-key YOUR_WIREGUARD_KEY</code></pre>
          <p className={p}>
            Step-by-step setup:{" "}
            <Link className="text-accent underline" href="/guides/jellyfin-sonarr-radarr-stack-proxmox-lxc">
              Jellyfin + Sonarr + Radarr guide
            </Link>
            . In a Proxmox LXC enable nesting and keyctl, and pass /dev/net/tun for gluetun.
          </p>
        </section>

        <section className={card}>
          <h2 className={h2}>Manage it: the <code>hldeck</code> command</h2>
          <pre className={code}><code>{`hldeck status    # health and URLs of every service
hldeck update    # pull new images and restart
hldeck backup    # configs and volumes to /var/backups/hldeck (keeps the last 7)
hldeck export    # plain Docker files, no secrets, no hldeck needed
hldeck wire      # connect Prowlarr, Sonarr, Radarr and qBittorrent (media stack)`}</code></pre>
          <p className={p}>wire sets root folders and the qBittorrent download client, and links Prowlarr to Sonarr and Radarr. You still create the Jellyfin user and libraries, add your indexers and set up Seerr yourself. Backups skip the media and torrent folders (too large). The archive can contain your VPN key, so it is saved readable by root only.</p>
        </section>

        <section className={card}>
          <h2 className={h2}>Read before you run</h2>
          <p className={p}>
            Piping a script into a shell means trusting it. Download it first and read it:{" "}
            <a className="text-accent underline" href="/install.sh">install.sh</a>,{" "}
            <a className="text-accent underline" href="/hldeck.sh">hldeck.sh</a>. Use{" "}
            <code>bash install.sh media --dry-run</code> to generate the files without installing anything.
            Source and issues:{" "}
            <a className="text-accent underline" href="https://github.com/Darkboy7766/hldeck">github.com/Darkboy7766/hldeck</a> (MIT).
            Use torrents only for content you have the right to download.
          </p>
        </section>
      </main>
    </div>
  );
}
