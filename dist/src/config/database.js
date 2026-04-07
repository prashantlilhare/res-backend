"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../lib/logger");
const mongoUri = process.env["DATABASE_URL"];
if (!mongoUri) {
    throw new Error("DATABASE_URL environment variable is required");
}
async function connectDatabase() {
    try {
        await mongoose_1.default.connect(mongoUri);
        logger_1.logger.info("MongoDB connection established");
    }
    catch (err) {
        logger_1.logger.error({ err }, "Failed to connect to MongoDB");
        throw err;
    }
}
//# sourceMappingURL=database.js.map