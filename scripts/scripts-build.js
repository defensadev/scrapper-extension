const { build } = require("esbuild");
const NodeResolve = require("@esbuild-plugins/node-resolve").default;
const path = require("path");

const cwd = process.cwd();
const entryPoints = ["start.ts", "build.ts"].map((p) =>
  path.resolve(cwd, "./scripts/src", p)
);
const outdir = path.resolve(cwd, "./scripts/dist");

build({
  bundle: true,
  entryPoints,
  format: "cjs",
  target: "node14",
  outdir,
  platform: "node",
  write: true,
  plugins: [
    NodeResolve({
      extensions: [".ts", ".js"],
      onResolved: (resolved) => {
        if (resolved.includes("node_modules")) {
          return {
            external: true,
          };
        }
        return resolved;
      },
    }),
  ],
});
