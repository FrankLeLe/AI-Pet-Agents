import { HatchExperience } from "./HatchExperience";

import { normalizeLanguage, PageShell } from "../_components/SiteChrome";

type HatchPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function HatchPage({ searchParams }: HatchPageProps) {
  const query = await searchParams;
  const language = normalizeLanguage(query.lang);

  return (
    <PageShell language={language} currentPath="/hatch">
      <HatchExperience language={language} />
    </PageShell>
  );
}
