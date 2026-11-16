/**
 * An app's own logo from `/public/icons`. The tile stays white in both themes
 * because several logos are single-colour black and vanish on a dark card.
 */
export default function AppIcon({
  icon,
  size = 40,
}: {
  icon?: string;
  size?: number;
}) {
  if (!icon) return null;
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-lg border border-black/[.08] bg-white p-1.5 dark:border-white/[.12]"
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/icons/${icon}`}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-contain"
      />
    </span>
  );
}
