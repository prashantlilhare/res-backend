"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const required = (key) => {
    const value = process.env[key];
    if (!value)
        throw new Error(`Missing required environment variable: ${key}`);
    return value;
};
exports.env = {
    PORT: Number(required("PORT")),
    NODE_ENV: process.env["NODE_ENV"] ?? "development",
    JWT_SECRET: required("SESSION_SECRET"),
    JWT_EXPIRES_IN: "7d",
};
//# sourceMappingURL=env.js.map