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

  return {
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
