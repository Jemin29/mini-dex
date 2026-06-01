import http from "http";
import { createApp } from "@/app";
import { env } from "@/config/env";
import { initWebSocket } from "@/ws/wsServer";
import { startIndexer } from "@/services/indexerService";

const app = createApp();
const server = http.createServer(app);

initWebSocket(server);
startIndexer();

server.listen(env.port, () => {
  console.log(`Backend listening on :${env.port}`);
});
