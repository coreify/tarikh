import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const readmePath = resolve(currentDir, "..", "README.md");

function sectionBody(readme: string, heading: string): string {
  const lines = readme.split(/\r?\n/);
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const headingPattern = new RegExp(`^(#{1,6})\\s+${escaped}\\s*$`);
  let startIndex = -1;
  let headingLevel = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index]!.match(headingPattern);
    if (!match) continue;
    startIndex = index + 1;
    headingLevel = match[1]!.length;
    break;
  }

  if (startIndex === -1) return "";

  const body: string[] = [];
  for (let index = startIndex; index < lines.length; index += 1) {
    const line = lines[index]!;
    const headingMatch = line.match(/^(#{1,6})\s+/);
    if (headingMatch && headingMatch[1]!.length <= headingLevel) break;
    body.push(line);
  }

  return body.join("\n").trim();
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
    expect(sectionBody(readme, "Hijri Calendar")).not.toBe("");
    expect(sectionBody(readme, "React Components")).not.toBe("");
    expect(sectionBody(readme, "Demo")).not.toBe("");
  });

  it("keeps code fences balanced", async () => {
    const readme = await readFile(readmePath, "utf8");
    expect(() => assertBalancedCodeFences(readme)).not.toThrow();
  });

  it("uses absolute URLs for the top badges", async () => {
    const readme = await readFile(readmePath, "utf8");

    expect(readme).toMatch(
      /https:\/\/www\.npmjs\.com\/package\/@coreify\/tarikh/
    );
    expect(readme).toMatch(
      /https:\/\/img\.shields\.io\/npm\/v\/@coreify\/tarikh/
    );
    expect(readme).toMatch(
      /https:\/\/img\.shields\.io\/npm\/dm\/@coreify\/tarikh/
    );
    expect(readme).toMatch(
      /https:\/\/img\.shields\.io\/npm\/l\/@coreify\/tarikh/
    );
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
    expect(patternSection).toContain("`format()` is the primary API.");
    expect(readme).toMatch(/pattern.*mode.*disallowed in TypeScript/i);
    expect(readme).not.toContain('format("2026-04-14", "bangla"');
  });

  it("keeps the compound React API as the primary story", async () => {
    const readme = await readFile(readmePath, "utf8");
    const reactSection = sectionBody(readme, "React Components");

    expect(reactSection).toContain(
      'import { Tarikh } from "@coreify/tarikh/react";'
    );
    expect(reactSection).toContain('const date = "2026-03-31";');
    expect(reactSection).toContain("<Tarikh value={date} />");
    expect(reactSection).toContain("<Tarikh.Relative value={date} />");
    expect(reactSection).toContain(
      '<Tarikh.Bangla value={date} locale="bn-BD" />'
    );
    expect(reactSection).toContain(
      '<Tarikh.Hijri value={date} locale="bn-BD" />'
    );
    expect(reactSection).not.toContain("import { RelativeTime");
    expect(reactSection).not.toContain("import { BanglaDate");
  });

  it("highlights the Bangla calendar core feature", async () => {
    const readme = await readFile(readmePath, "utf8");
    expect(readme).toContain('format("2026-04-14", {');
    expect(readme).toContain('mode: "bangla"');
    expect(readme).toContain('format: "spoken"');
  });

  it("highlights the Hijri calendar feature", async () => {
    const readme = await readFile(readmePath, "utf8");
    const hijriSection = sectionBody(readme, "Hijri Calendar");

    expect(hijriSection).toContain('format("2026-03-31", {');
    expect(hijriSection).toContain('mode: "hijri"');
    expect(hijriSection).toContain(
      "import { HIJRI_TIME_ZONES, format, toHijriCalendar }"
    );
  });

  it("includes a simple external demo link", async () => {
    const readme = await readFile(readmePath, "utf8");
    const demoSection = sectionBody(readme, "Demo");

    expect(demoSection).toContain("| Demo | Link |");
    expect(demoSection).toContain("| Live demo |");
    expect(demoSection).toContain("https://tarikh.js.org");
  });

  it("documents bracket literals for pattern formatting", async () => {
    const readme = await readFile(readmePath, "utf8");
    expect(readme).toContain(
      "Use square brackets to keep literal text untouched by token replacement:"
    );
    expect(readme).toContain("[Today at] h:mm a");
    expect(readme).toContain("Bracket literals are not nestable");
  });
});
