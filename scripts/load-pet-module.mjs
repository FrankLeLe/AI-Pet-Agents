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
  const [animationSource, editorialSource, petsSource] = await Promise.all([
    transpile("pet-animation.ts"),
    transpile("pet-content.ts"),
    transpile("pets.ts"),
  ]);
  const animationUrl = toDataUrl(animationSource);
  const editorialUrl = toDataUrl(editorialSource);
  const linkedPetsSource = petsSource
    .replaceAll('"./pet-animation"', `"${animationUrl}"`)
    .replaceAll('"./pet-content"', `"${editorialUrl}"`);

  return import(toDataUrl(linkedPetsSource));
}
