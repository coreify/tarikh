import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const readmePath = resolve(currentDir, "..", "README.md");

function assertBalancedCodeFences(readme: string): void {
  const lines = readme.split(/\r?\n/);
  let openFenceLine: number | null = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]!;
    const trimmed = line.trim();

    if (!trimmed.startsWith("```")) continue;

    if (trimmed === "```") {
      if (openFenceLine === null) {
        throw new Error(`Closing fence without opening fence at line ${index + 1}`);
      }
      openFenceLine = null;
      continue;
    }

    if (openFenceLine !== null) {
      throw new Error(
        `Nested opening fence at line ${index + 1}; previous fence opened at line ${openFenceLine}`
      );
    }

    openFenceLine = index + 1;
  }

  if (openFenceLine !== null) {
    throw new Error(`Unclosed fence opened at line ${openFenceLine}`);
  }
}

describe("README contract", () => {
  it("keeps code fences balanced", async () => {
    const readme = await readFile(readmePath, "utf8");
    expect(() => assertBalancedCodeFences(readme)).not.toThrow();
  });

  it("uses absolute URLs for the top badges", async () => {
    const readme = await readFile(readmePath, "utf8");

    expect(readme).toContain(
      "https://www.npmjs.com/package/@coreify/tarikh"
    );
    expect(readme).toContain(
      "https://img.shields.io/npm/v/@coreify/tarikh"
    );
    expect(readme).toContain(
      "https://img.shields.io/npm/dm/@coreify/tarikh"
    );
    expect(readme).toContain(
      "https://img.shields.io/npm/l/@coreify/tarikh"
    );
    expect(readme).toContain(
      "https://github.com/coreify/tarikh/blob/main/package/LICENSE"
    );
  });

  it("teaches the object-based format API", async () => {
    const readme = await readFile(readmePath, "utf8");

    expect(readme).toContain("npm version");
    expect(readme).toContain("downloads");
    expect(readme).toContain("license");
    expect(readme).toContain("Use `format()` for everything.");
    expect(readme).toContain('format(new Date(), { mode: "standard" });');
    expect(readme).toContain('format(new Date(), { mode: "bangla" });');
    expect(readme).toContain('format(new Date(), { mode: "hybrid" });');
    expect(readme).toContain('format(new Date(), { pattern: "DD MMM YYYY" });');
    expect(readme).not.toContain('format("2026-04-14", "bangla"');
  });

  it("keeps the compound React API as the primary story", async () => {
    const readme = await readFile(readmePath, "utf8");

    expect(readme).toContain('import { Tarikh } from "@coreify/tarikh/react";');
    expect(readme).toContain('<Tarikh value={new Date()} />');
    expect(readme).toContain("<Tarikh.Relative value={new Date()} />");
    expect(readme).toContain("<Tarikh.Bangla value={new Date()} locale=\"bn-BD\" />");
    expect(readme).not.toContain("import { RelativeTime");
    expect(readme).not.toContain("import { BanglaDate");
  });

  it("highlights the Bangla calendar core feature", async () => {
    const readme = await readFile(readmePath, "utf8");

    expect(readme).toContain("## 🇧🇩 Bangla Calendar (Core Feature)");
    expect(readme).toContain("If you're building for Bangladesh, existing libraries are not enough.");
    expect(readme).toContain('format("2026-04-14", {');
    expect(readme).toContain('mode: "bangla"');
    expect(readme).toContain('format: "spoken"');
  });

  it("includes a concrete live demo snippet", async () => {
    const readme = await readFile(readmePath, "utf8");

    expect(readme).toContain("## Live Demo");
    expect(readme).toContain("Input:");
    expect(readme).toContain("2026-04-14");
    expect(readme).toContain("standard → 14 Apr 2026");
    expect(readme).toContain("bangla → ১লা বৈশাখ ১৪৩৩");
    expect(readme).toContain("spoken → পহেলা বৈশাখ ১৪৩৩");
  });
});
