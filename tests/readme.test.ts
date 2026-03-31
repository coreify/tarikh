import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const readmePath = resolve(currentDir, "..", "README.md");

function sectionBody(readme: string, heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `^##+\\s+${escaped}\\s*$([\\s\\S]*?)(?=^##+\\s+|\\Z)`,
    "m"
  );
  const match = readme.match(regex);
  return match?.[1]?.trim() ?? "";
}

function fencedCodeBlocks(readme: string): string[] {
  const blocks: string[] = [];
  const regex = /```[^\n]*\n([\s\S]*?)\n```/g;
  let match: RegExpExecArray | null = regex.exec(readme);

  while (match !== null) {
    blocks.push(match[1]!);
    match = regex.exec(readme);
  }

  return blocks;
}

function assertBalancedCodeFences(readme: string): void {
  const lines = readme.split(/\r?\n/);
  let openFenceLine: number | null = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]!;
    const trimmed = line.trim();

    if (!trimmed.startsWith("```")) continue;
    if (openFenceLine === null) {
      openFenceLine = index + 1;
      continue;
    }
    openFenceLine = null;
  }

  if (openFenceLine !== null) {
    throw new Error(`Unclosed fence opened at line ${openFenceLine}`);
  }
}

describe("README contract", () => {
  it("keeps core sections discoverable", async () => {
    const readme = await readFile(readmePath, "utf8");

    expect(sectionBody(readme, "Quick Start")).not.toBe("");
    expect(sectionBody(readme, "🇧🇩 Bangla Calendar (Core Feature)")).not.toBe("");
    expect(sectionBody(readme, "React Components")).not.toBe("");
    expect(sectionBody(readme, "Live Demo")).not.toBe("");
  });

  it("keeps code fences balanced", async () => {
    const readme = await readFile(readmePath, "utf8");
    expect(() => assertBalancedCodeFences(readme)).not.toThrow();
  });

  it("uses absolute URLs for the top badges", async () => {
    const readme = await readFile(readmePath, "utf8");

    expect(readme).toMatch(/https:\/\/www\.npmjs\.com\/package\/@coreify\/tarikh/);
    expect(readme).toMatch(/https:\/\/img\.shields\.io\/npm\/v\/@coreify\/tarikh/);
    expect(readme).toMatch(/https:\/\/img\.shields\.io\/npm\/dm\/@coreify\/tarikh/);
    expect(readme).toMatch(/https:\/\/img\.shields\.io\/npm\/l\/@coreify\/tarikh/);
    expect(readme).toMatch(
      /\[!\[license\]\(https:\/\/img\.shields\.io\/npm\/l\/@coreify\/tarikh\)\]\(https:\/\/github\.com\/coreify\/tarikh\/blob\/.+\/package\/LICENSE\)/
    );
  });

  it("documents the object-based format API", async () => {
    const readme = await readFile(readmePath, "utf8");
    const patternSection = sectionBody(readme, "Pattern Formatting");
    const code = fencedCodeBlocks(readme).join("\n");

    expect(readme).toContain("format()");
    expect(code).toMatch(/mode:\s*"standard"/);
    expect(code).toMatch(/mode:\s*"bangla"/);
    expect(code).toMatch(/mode:\s*"hybrid"/);
    expect(code).toMatch(/pattern:\s*"DD MMM YYYY"/);
    expect(patternSection).toMatch(/mode.*pattern.*mutually exclusive/i);
    expect(patternSection).toMatch(/do not pass.*mode/i);
    expect(readme).toMatch(/pattern.*mode.*disallowed in TypeScript/i);
    expect(readme).not.toContain('format("2026-04-14", "bangla"');
  });

  it("keeps the compound React API as the primary story", async () => {
    const readme = await readFile(readmePath, "utf8");
    const reactSection = sectionBody(readme, "React Components");

    expect(reactSection).toContain('import { Tarikh } from "@coreify/tarikh/react";');
    expect(reactSection).toContain("<Tarikh value={new Date()} />");
    expect(reactSection).toContain("<Tarikh.Relative value={new Date()} />");
    expect(reactSection).toContain(
      '<Tarikh.Bangla value={new Date()} locale="bn-BD" />'
    );
    expect(reactSection).not.toContain("import { RelativeTime");
    expect(reactSection).not.toContain("import { BanglaDate");
  });

  it("highlights the Bangla calendar core feature", async () => {
    const readme = await readFile(readmePath, "utf8");
    const banglaSection = sectionBody(readme, "🇧🇩 Bangla Calendar (Core Feature)");

    expect(banglaSection).toContain('format("2026-04-14", {');
    expect(banglaSection).toContain('mode: "bangla"');
    expect(banglaSection).toContain('format: "spoken"');
  });

  it("includes a concrete live demo snippet", async () => {
    const readme = await readFile(readmePath, "utf8");
    const liveDemoSection = sectionBody(readme, "Live Demo");

    expect(liveDemoSection).toContain("Input:");
    expect(liveDemoSection).toContain("2026-04-14");
    expect(liveDemoSection).toContain("standard → 14 Apr 2026");
    expect(liveDemoSection).toContain("bangla → ১লা বৈশাখ ১৪৩৩");
    expect(liveDemoSection).toContain("spoken → পহেলা বৈশাখ ১৪৩৩");
  });

  it("documents bracket literals for pattern formatting", async () => {
    const readme = await readFile(readmePath, "utf8");
    expect(readme).toContain(
      "Use square brackets to keep literal text untouched by token replacement:"
    );
    expect(readme).toContain('[Today at] h:mm a');
    expect(readme).toContain("Bracket literals are not nestable");
  });
});
