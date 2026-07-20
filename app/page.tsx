import { HomeExperience } from "./_components/HomeExperience";
import { normalizeLanguage, PageShell } from "./_components/SiteChrome";
import { getPetById, PETS } from "@/lib/pets";

type HomePageProps = {
  searchParams: Promise<{
    lang?: string | string[];
    pet?: string | string[];
  }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const query = await searchParams;
  const language = normalizeLanguage(query.lang);
  const requestedPet = Array.isArray(query.pet) ? query.pet[0] : query.pet;
  const pet = (requestedPet && getPetById(requestedPet)) || PETS[0];

  return (
    <PageShell language={language} currentPath="/">
      <HomeExperience
        language={language}
        petId={pet.id}
        petName={pet.displayName[language]}
      />
    </PageShell>
  );
}
