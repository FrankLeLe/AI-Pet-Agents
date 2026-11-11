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
  const [animationSource, editorialSource, petsSource, bleachSource] = await Promise.all([
    transpile("pet-animation.ts"),
    transpile("pet-content.ts"),
    transpile("pets.ts"),
    transpile("bleach-content.ts"),
  ]);
  const animationUrl = toDataUrl(animationSource);
  const bleachUrl = toDataUrl(bleachSource);
  const editorialUrl = toDataUrl(editorialSource.replaceAll('"./bleach-content"', `"${bleachUrl}"`));
  const linkedPetsSource = petsSource
    .replaceAll('"./pet-animation"', `"${animationUrl}"`)
    .replaceAll('"./pet-content"', `"${editorialUrl}"`);
  const linkedCatalogSource = linkedPetsSource.replaceAll('"./bleach-content"', `"${bleachUrl}"`);

  return import(toDataUrl(linkedCatalogSource));
}

export async function loadPetPowerModule() {
  return import(toDataUrl(await transpile("pet-powers.ts")));
}

export async function loadPetReleaseModule() {
  const releaseSource = await transpile("pet-releases.ts");
  return import(toDataUrl(releaseSource));
}
