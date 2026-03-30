import { readFileSync, writeFileSync } from "node:fs";
import { defineConfig } from "tsup";

const sharedConfig = {
  format: [...(["esm", "cjs"] as const)],
  dts: true,
  sourcemap: false,
  splitting: false,
  target: "es2020",
  treeshake: true,
  minify: "terser" as const,
  external: ["react"]
};

function preserveUseClientDirective(): void {
  for (const file of ["dist/react.js", "dist/react.cjs"]) {
    const content = readFileSync(file, "utf8");
    const trimmed = content.trimStart();
    if (
      trimmed.startsWith('"use client"') ||
      trimmed.startsWith("'use client'")
    ) {
      continue;
    }
    writeFileSync(file, `"use client";\n${content}`);
  }
}

export default defineConfig([
  {
    ...sharedConfig,
    entry: {
      index: "src/index.ts"
    },
    clean: true
  },
  {
    ...sharedConfig,
    entry: {
      react: "src/react/index.tsx"
    },
    clean: false,
    banner: {
      js: '"use client";'
    },
    async onSuccess() {
      preserveUseClientDirective();
    }
  }
]);
