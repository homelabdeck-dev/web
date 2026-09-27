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
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
