import { readFile } from "node:fs/promises";
import ts from "typescript";

const libUrl = new URL("../lib/", import.meta.url);

function toDataUrl(source) {
  return `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
}

async function transpile(relativePath) {
  const source = await readFile(new URL(relativePath, libUrl), "utf8");
  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: relativePath,
    reportDiagnostics: true,
  });
  const errors = (result.diagnostics ?? []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );

  if (errors.length > 0) {
    throw new Error(
      errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")).join("\n"),
    );
  }

  return result.outputText;
}

export async function loadPetModule() {
  const [animationSource, editorialSource, petsSource, bleachSource, captainSource] = await Promise.all([
    transpile("pet-animation.ts"),
    transpile("pet-content.ts"),
    transpile("pets.ts"),
    transpile("bleach-content.ts"),
    transpile("gotei-captains.ts"),
  ]);
  const animationUrl = toDataUrl(animationSource);
  const bleachUrl = toDataUrl(bleachSource);
  const captainUrl = toDataUrl(captainSource);
  const linkCollections = (source) => source
    .replaceAll('"./bleach-content"', `"${bleachUrl}"`)
    .replaceAll('"./gotei-captains"', `"${captainUrl}"`);
  const editorialUrl = toDataUrl(linkCollections(editorialSource));
  const linkedPetsSource = petsSource
    .replaceAll('"./pet-animation"', `"${animationUrl}"`)
    .replaceAll('"./pet-content"', `"${editorialUrl}"`);
  const linkedCatalogSource = linkCollections(linkedPetsSource);

  return import(toDataUrl(linkedCatalogSource));
}

export async function loadPetPowerModule() {
  const [powers, captains] = await Promise.all([transpile("pet-powers.ts"), transpile("gotei-captains.ts")]);
  return import(toDataUrl(powers.replaceAll('"./gotei-captains"', `"${toDataUrl(captains)}"`)));
}

export async function loadPetReleaseModule() {
  const releaseSource = await transpile("pet-releases.ts");
  return import(toDataUrl(releaseSource));
}
