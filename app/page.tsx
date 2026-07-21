import { HomeExperience } from "./_components/HomeExperience";
import { normalizeLanguage, PageShell } from "./_components/SiteChrome";
import { getPetById } from "@/lib/pets";
import {
  GUIDE_PET_ID,
  GUIDE_PROFILE,
  getSeriesPets,
  PET_SERIES,
} from "@/lib/series";

type HomePageProps = {
  searchParams: Promise<{
    lang?: string | string[];
  }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const query = await searchParams;
  const language = normalizeLanguage(query.lang);
  const guide = getPetById(GUIDE_PET_ID);
  const series = PET_SERIES[0];

  if (!guide) return null;

  const members = getSeriesPets(series).map(({ pet, profile }) => ({
    petId: pet.id,
    name: profile.name[language],
    zodiac: profile.zodiac[language],
    role: profile.role[language],
    specialty: profile.specialty[language],
    accent: pet.accent,
    softAccent: pet.softAccent,
  }));

  return (
    <PageShell language={language} currentPath="/">
      <HomeExperience
        language={language}
        guide={{
          petId: guide.id,
          name: GUIDE_PROFILE.name[language],
          title: GUIDE_PROFILE.title[language],
          role: GUIDE_PROFILE.role[language],
          description: GUIDE_PROFILE.description[language],
        }}
        series={{
          id: series.id,
          name: series.name[language],
          subtitle: series.subtitle[language],
          status: series.status[language],
          description: series.description[language],
          storyTitle: series.storyTitle[language],
          storyChapter: series.storyChapter[language],
          story: series.story[language],
          members,
        }}
      />
    </PageShell>
  );
}
