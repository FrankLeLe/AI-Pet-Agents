import type { MetadataRoute } from "next";

import { PETS } from "@/lib/pets";
import { PET_SERIES } from "@/lib/series";

const origin = "https://aipetsagent.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-07-20T00:00:00.000Z");
  const corePaths = ["", "/pets", "/install", "/hatch", "/help"];
  const petPaths = PETS.flatMap((pet) => [
    `/pets/${pet.id}`,
    `/install/${pet.id}`,
  ]);
  const seriesPaths = PET_SERIES.map((series) => `/series/${series.id}`);

  return [...corePaths, ...seriesPaths, ...petPaths].map((path, index) => ({
    url: `${origin}${path}`,
    lastModified: updated,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : path.startsWith("/pets/") ? 0.8 : 0.7,
  }));
}
