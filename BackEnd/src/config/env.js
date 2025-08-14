import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// look one level up (BackEnd/.env) by default
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("env loaded, MONGO_URI?", !!process.env.MONGO_URI);