function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

function getOptionalEnv(
  key: string,
  defaultValue?: string,
): string | undefined {
  return process.env[key] ?? defaultValue;
}

export const env = {
  LLM_API_KEY: getRequiredEnv("LLM_API_KEY"),
  LLM_BASE_URL: getRequiredEnv("LLM_BASE_URL"),
  NODE_ENV: getOptionalEnv("NODE_ENV", "development"),
  PORT: getOptionalEnv("PORT", "3000"),
} as const;
