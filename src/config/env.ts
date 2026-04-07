const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export const env = {
  PORT: Number(required("PORT")),
  NODE_ENV: process.env["NODE_ENV"] ?? "development",
  JWT_SECRET: required("SESSION_SECRET"),
  JWT_EXPIRES_IN: "7d",
} as const;
