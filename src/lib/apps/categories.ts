/** Category taxonomy used to tag/filter app entries. */
export interface Category {
  slug: string;
  labelEn: string;
  labelBg: string;
}

export const categories: Category[] = [
  { slug: "photos", labelEn: "Photos", labelBg: "Снимки" },
  { slug: "media", labelEn: "Media", labelBg: "Медия" },
  { slug: "notes-docs", labelEn: "Notes/Docs", labelBg: "Бележки/Документи" },
  { slug: "monitoring", labelEn: "Monitoring", labelBg: "Мониторинг" },
  { slug: "networking", labelEn: "Networking", labelBg: "Мрежи" },
  { slug: "automation", labelEn: "Automation", labelBg: "Автоматизация" },
  {
    slug: "password-management",
    labelEn: "Password Management",
    labelBg: "Управление на пароли",
  },
  { slug: "backup", labelEn: "Backup", labelBg: "Архивиране" },
  {
    slug: "cloud-storage-files",
    labelEn: "Cloud Storage & Files",
    labelBg: "Облачно съхранение и файлове",
  },
  {
    slug: "home-automation",
    labelEn: "Home Automation",
    labelBg: "Домашна автоматизация",
  },
  {
    slug: "container-management",
    labelEn: "Container Management",
    labelBg: "Управление на контейнери",
  },
  {
    slug: "developer-tools",
    labelEn: "Developer Tools",
    labelBg: "Инструменти за разработчици",
  },
  {
    slug: "rss-reading",
    labelEn: "RSS & Reading",
    labelBg: "RSS и четене",
  },
  {
    slug: "ai-audio",
    labelEn: "AI & Audio",
    labelBg: "ИИ и аудио",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
