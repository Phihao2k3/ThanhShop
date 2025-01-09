import "dotenv/config";
export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
  APP_HOST: process.env.APP_HOST || "localhost",
  APP_PORT: process.env.APP_PORT || 3000,
  BUILD_MODE: process.env.BUILD_MODE,
  URL_BASE: process.env.URL_BASE,
  JWT_KEY: process.env.JWT_KEY,
};
