import mongoose from "mongoose";
import { logger } from "../lib/logger";

const mongoUri = process.env["DATABASE_URL"];

if (!mongoUri) {
  throw new Error("DATABASE_URL environment variable is required");
}

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(mongoUri!);
    logger.info("MongoDB connection established");
  } catch (err) {
    logger.error({ err }, "Failed to connect to MongoDB");
    throw err;
  }
}
