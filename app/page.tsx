import type { Metadata } from "next";

import { HomeExperience } from "./_components/HomeExperience";
import { normalizeLanguage, PageShell } from "./_components/SiteChrome";
import { getPetById } from "@/lib/pets";
import {
  GUIDE_PET_ID,
  GUIDE_PROFILE,
  getEditorialSeries,
  getSeriesPets,
} from "@/lib/series";

type HomePageProps = {
  searchParams: Promise<{
    lang?: string | string[];
  }>;
};

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const query = await searchParams;
  const language = normalizeLanguage(query.lang);
  const title = language === "zh"
    ? "Codex Pets｜给 Codex 选一位会动的伙伴"
    : "Codex Pets | Find your desktop companion";
  const description = language === "zh"
    ? "认识各具性格的桌面伙伴，试试日常动作与力量互动，选一位带回 Codex。"
    : "Meet distinctive desktop companions, try everyday moves and power interactions, and bring a favorite to Codex.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: language === "zh" ? "zh_CN" : "en_US",
      url: language === "zh" ? "/" : "/?lang=en",
      images: [{ url: "/og-series.png", width: 1672, height: 941, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-series.png"] },
    alternates: {
      canonical: language === "en" ? "/?lang=en" : "/",
      languages: {
        "zh-CN": "/?lang=zh",
        en: "/?lang=en",
        "x-default": "/",
      },
    },
  };
}

export default async function Home({ searchParams }: HomePageProps) {
  const query = await searchParams;
  const language = normalizeLanguage(query.lang);
  const guide = getPetById(GUIDE_PET_ID);
  const series = getEditorialSeries();

  if (!guide || series.length === 0) return null;

  return (
    <PageShell language={language} currentPath="/">
      <HomeExperience
        language={language}
        guide={{
          petId: guide.id,
          name: GUIDE_PROFILE.name[language],
          title: GUIDE_PROFILE.name[language],
          role: GUIDE_PROFILE.role[language],
          description:
            language === "zh"
              ? "任务很长的时候，它负责让等待没那么安静。"
              : "When a task runs long, it makes the waiting feel less quiet.",
        }}
        series={series.map((collection) => ({
          id: collection.id,
          name: collection.name[language],
          subtitle: collection.subtitle[language],
          status: collection.status[language],
          description: collection.description[language],
          selectionTitle: collection.selectionTitle[language],
          storyTitle: collection.storyTitle[language],
          storyChapter: collection.storyChapter[language],
          story: collection.story[language],
          members: getSeriesPets(collection).map(({ pet, profile }) => ({
            petId: pet.id,
            name: profile.name[language],
            zodiac: profile.zodiac[language],
            role: profile.role[language],
            specialty: profile.specialty[language],
            accent: pet.accent,
            softAccent: pet.softAccent,
          })),
        }))}
      />
    </PageShell>
  );
}
