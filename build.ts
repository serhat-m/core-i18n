import { build } from "tsup"

await build({
  tsconfig: "./tsconfig.json",
  entry: ["src/index.ts"],
  sourcemap: false,
  minify: false,
  format: ["esm", "cjs"],
  outDir: "dist",
  clean: true,
  dts: true,
})
