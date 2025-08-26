import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// look one level up (BackEnd/.env) by default
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("env loaded, MONGO_URI?", !!process.env.MONGO_URI);

export const env = {                              // a box that holds important secret notes
  NODE_ENV: process.env.NODE_ENV ?? "development",// are we in dev or prod? if unknown, say "development"
  PORT: Number(process.env.PORT ?? 4000),         // which door number (port) we listen on
  MONGO_URI: process.env.MONGO_URI ??             // where is our toy box (database)
    "mongodb://127.0.0.1:27017/fortis",
  JWT_SECRET: process.env.JWT_SECRET ??           // magic word to sign login tickets (JWT)
    "dev-change-me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ??   // how long the ticket stays valid
    "2h",
  COOKIE_SECURE: process.env.COOKIE_SECURE === "true", // should cookies only go over https?

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",        // Google key (we fill later)
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? "",// Google secret (we fill later)
  GOOGLE_CALLBACK_URL:
    process.env.GOOGLE_CALLBACK_URL
    ?? "http://localhost:4000/api/auth/google/callback",       // where Google sends us back

  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "", // key for AI helper (optional)
};