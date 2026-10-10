"use client";

import { useRef, useState } from "react";

type Screenshot = {
  filename: string;
  label: string;
  alt: string;
};

export default function ScreenshotGallery({
  slug,
  screenshots,
  closeLabel,
}: {
  slug: string;
  screenshots: Screenshot[];
  closeLabel: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Screenshot | null>(null);

  const open = (shot: Screenshot) => {
    setActive(shot);
    dialogRef.current?.showModal();
  };

  const close = () => {
    dialogRef.current?.close();
    setActive(null);
  };

  return (
    <>
      <ul className="grid grid-cols-3 gap-3">
        {screenshots.map((shot) => (
          <li
            key={shot.filename}
            className="flex flex-col gap-2 overflow-hidden rounded-lg border border-black/[.08] dark:border-white/[.12] bg-white dark:bg-zinc-900"
          >
            <button
              type="button"
              onClick={() => open(shot)}
              className="cursor-zoom-in"
              aria-label={shot.alt}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/screenshots/${slug}/${shot.filename}`}
                alt={shot.alt}
                className="h-auto w-full object-contain"
                loading="lazy"
              />
            </button>
            <span className="px-2 pb-2 text-center text-xs text-zinc-600 dark:text-zinc-300 sm:text-sm">
              {shot.label}
            </span>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setActive(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="m-auto max-h-[90vh] max-w-[90vw] overflow-visible rounded-lg bg-transparent p-0 backdrop:bg-black/80"
      >
        {active && (
          <div className="relative">
            <button
              type="button"
              onClick={close}
              aria-label={closeLabel}
              className="absolute -top-10 right-0 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-black hover:bg-white"
            >
              ✕ {closeLabel}
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/screenshots/${slug}/${active.filename}`}
              alt={active.alt}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            />
          </div>
        )}
      </dialog>
    </>
  );
}
