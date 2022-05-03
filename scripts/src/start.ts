import express from "express";
import morgan from "morgan";
import http from "http";
import { Server } from "ws";
import staticRouter, { wsRouter, jsRouter } from "./server/staticRouter";
import { publicPath, extensionPublicPath } from "./env";

const webApp = express();
const httpServer = http.createServer(webApp);
const wsServer = new Server({ clientTracking: false, noServer: true });

webApp.use(morgan("dev"));
webApp.use("/", jsRouter);
webApp.use("/netlify", express.static(publicPath));
webApp.use("/extension", express.static(extensionPublicPath));
webApp.use("/", staticRouter);

wsServer.on("connection", wsRouter);

httpServer.on("upgrade", (req, socket, head) =>
  wsServer.handleUpgrade(req, socket, head, (ws, wsReq) =>
    wsServer.emit("connection", ws, wsReq)
  )
);

httpServer.listen(3000, () => console.log("Listening on port 3000!"));
