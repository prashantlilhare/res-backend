import "dotenv/config";
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import app from "./app";
import { env } from "./src/config/env";
import { connectDatabase } from "./src/config/database";
import { logger } from "./src/lib/logger";

const PORT = env.PORT;

async function start(): Promise<void> {
  await connectDatabase();

  app.get("/", (req, res) => {
    res.send("Restaurant backend is running ✅");
  });

  app.listen(PORT, (err) => {
    if (err) {
      logger.error({ err }, "Error starting server");
      process.exit(1);
    }
    logger.info({ port: env.PORT, env: env.NODE_ENV }, "Server started");
  });
}

start().catch((err) => {
  logger.error({ err }, "Fatal startup error");
  process.exit(1);
});
