import { build, analyzeMetafile } from "esbuild";
import path from "path";
import fs from "fs";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import { extensionPublicPath, mainCSSPath, publicPath } from "../env";

export const TSBuilder = async (
  entryPoint: string,
  outfile: string,
  production: boolean
) => {
  const res = await build({
    bundle: true,
    entryPoints: [entryPoint],
    format: "iife",
    minify: production,
    minifySyntax: production,
    minifyWhitespace: production,
    minifyIdentifiers: production,
    outfile,
    platform: "browser",
    treeShaking: production,
    write: true,
    metafile: production,
  });

  if (production) {
    console.log(await analyzeMetafile(res.metafile as any, { color: true }));
  }
};

const cssPath = (p: string): string => {
  return path.resolve(p, "./**/*.{html,js}");
};

let mainCSS: null | string = null;

export const CSSBuilder = async (
  production: boolean,
  dir?: string,
  outfile?: string
) => {
  if (!mainCSS) {
    mainCSS = await fs.promises.readFile(mainCSSPath, "utf-8");
  }

  if (!dir || !outfile) {
    await Promise.all(
      [extensionPublicPath, publicPath].map((p) =>
        CSSBuilder(production, p, path.resolve(p, "./index.css"))
      )
    );
    return;
  }

  const tailwindConfig = {
    content: [cssPath(dir)],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  const plugins: Array<any> = [tailwindcss(tailwindConfig)];
  if (production) {
    plugins.push(autoprefixer());
    plugins.push(cssnano());
  }
  const processor = postcss(plugins);

  const { css } = await processor.process(mainCSS, {
    from: mainCSSPath,
    to: outfile,
  });

  await fs.promises.writeFile(outfile, css, "utf-8");
};
