import fs from "fs";
import path from "path";
import { IncomingMessage } from "http";
import { Router } from "express";
import WebSocket from "ws";
import chokidar from "chokidar";
import {
  directoryFilePath,
  extensionBackground,
  extensionBackgroundOutfile,
  extensionContent,
  extensionContentOutfile,
  extensionEntry,
  extensionOutfile,
  extensionPublicPath,
  extensionSrc,
  publicPath,
  srcDir,
  srcEntry,
  srcOutfile,
} from "../env";
import { CSSBuilder, TSBuilder } from "./builder";

const staticRouter = Router();

staticRouter.get("/*", async (_, res) => {
  const directoryFile = await fs.promises.readFile(directoryFilePath, "utf-8");
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(directoryFile);
});

export default staticRouter;

export const jsRouter = Router();

const getFile = async (url: string): Promise<string | null> => {
  if (url.includes("extension")) {
    return await fs.promises
      .readFile(path.resolve(extensionPublicPath, "./index.html"), "utf-8")
      .catch(() => null);
  }
  if (url.includes("netlify")) {
    return await fs.promises
      .readFile(path.resolve(publicPath, "./index.html"), "utf-8")
      .catch(() => null);
  }
  return null;
};

jsRouter.get("/*", async (req, res, next) => {
  const wsJS = `
    (() => {
        const ws = new WebSocket(location.href.replace(/^http|https/, "ws"))
        ws.addEventListener("close", ev => ev.reason === "reload" && window.location.reload());
    })();
  `;

  if (
    req.headers &&
    req.headers.accept &&
    req.headers.accept.includes("text/html")
  ) {
    const rawHTML = await getFile(req.url);

    if (rawHTML) {
      const html = rawHTML.replace(
        "</head>",
        `<script>${wsJS}</script></head>`
      );
      res.setHeader("Content-Type", "text/html");
      res.status(200).send(html);
      return;
    }
  }
  next();
});

const srcWatcher = chokidar.watch(srcDir, { ignoreInitial: true });
const extSrcWatcher = chokidar.watch(extensionSrc, { ignoreInitial: true });
const publicWatcher = chokidar.watch(publicPath, { ignoreInitial: true });
const publicExtWatcher = chokidar.watch(extensionPublicPath, {
  ignoreInitial: true,
});

srcWatcher.on("change", () => TSBuilder(srcEntry, srcOutfile, false));
extSrcWatcher.on("change", () => {
  TSBuilder(extensionEntry, extensionOutfile, false);
  TSBuilder(extensionBackground, extensionBackgroundOutfile, false);
  TSBuilder(extensionContent, extensionContentOutfile, false);
});

export const wsRouter = (ws: WebSocket, req: IncomingMessage) => {
  let cssState = false;

  const isNetlify = req.url && req.url.includes("netlify");

  const listener = (p: string) => {
    if (ws.readyState !== ws.OPEN) {
      closeListener();
      return;
    }
    if (p.endsWith(".css")) {
      ws.close(1000, "reload");
      return;
    }
    if (!cssState) {
      cssState = true;
      CSSBuilder(false).finally(() => {
        cssState = false;
      });
    }
  };

  isNetlify && publicWatcher.on("change", listener);
  !isNetlify && publicExtWatcher.on("change", listener);

  const closeListener = () => {
    ws.removeAllListeners();
    publicWatcher.removeListener("change", listener);
    publicExtWatcher.removeListener("change", listener);
  };

  ws.addListener("close", closeListener);
};
