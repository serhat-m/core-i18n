import { build, type Options } from "tsup"

const options: Options = {
  tsconfig: "./tsconfig.json",
  entry: ["src/index.ts"],
  sourcemap: false,
  minify: false,
  dts: true,
  clean: true,
}

// ESM build
await build({
  ...options,
  format: "esm",
  outDir: "dist/esm",
})

// CJS build
await build({
  ...options,
  format: "cjs",
  outDir: "dist/cjs",
})
