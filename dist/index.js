"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const app_1 = __importDefault(require("./app"));
const env_1 = require("./src/config/env");
const database_1 = require("./src/config/database");
const logger_1 = require("./src/lib/logger");
const PORT = env_1.env.PORT;
async function start() {
    await (0, database_1.connectDatabase)();
    app_1.default.listen(PORT, (err) => {
        if (err) {
            logger_1.logger.error({ err }, "Error starting server");
            process.exit(1);
        }
        logger_1.logger.info({ port: env_1.env.PORT, env: env_1.env.NODE_ENV }, "Server started");
    });
}
start().catch((err) => {
    logger_1.logger.error({ err }, "Fatal startup error");
    process.exit(1);
});
//# sourceMappingURL=index.js.map