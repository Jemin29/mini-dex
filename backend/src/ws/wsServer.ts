import type { Server as HttpServer } from "http";
import { WebSocketServer } from "ws";
import { env } from "@/config/env";
import { eventBus } from "@/events/eventBus";
import type { Transaction } from "@/types";

export function initWebSocket(server: HttpServer) {
  const wss = new WebSocketServer({ server, path: env.wsPath });

  wss.on("connection", (socket) => {
    socket.send(JSON.stringify({ type: "connected" }));
  });

  eventBus.on("tx", (tx: Transaction) => {
    const payload = JSON.stringify({ type: "tx", data: tx });
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(payload);
      }
    });
  });
}
