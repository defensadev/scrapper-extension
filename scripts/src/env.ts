import path from "path";

const cwd = process.cwd();

export const publicPath = path.resolve(cwd, "./public");
export const extensionPublicPath = path.resolve(cwd, "./extension-public");

export const directoryFilePath = path.resolve(
  __dirname,
  "../directory-file.html"
);
export const mainCSSPath = path.resolve(__dirname, "../main.css");

export const srcEntry = path.resolve(cwd, "./src/index.ts");
export const srcOutfile = path.resolve(cwd, "./public/index.js");
export const extensionEntry = path.resolve(cwd, "./extension-src/index.ts");
export const extensionOutfile = path.resolve(
  cwd,
  "./extension-public/index.js"
);
export const extensionBackground = path.resolve(
  cwd,
  "./extension-src/background.ts"
);
export const extensionBackgroundOutfile = path.resolve(
  cwd,
  "./extension-public/background.js"
);
export const extensionContent = path.resolve(cwd, "./extension-src/content.ts");
export const extensionContentOutfile = path.resolve(
  cwd,
  "./extension-public/content.js"
);

export const srcDir = path.resolve(cwd, "./src");
export const extensionSrc = path.resolve(cwd, "./extension-src");
