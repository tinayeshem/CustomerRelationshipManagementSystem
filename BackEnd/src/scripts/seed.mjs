// scripts/seed.mjs
// ELI5: This script reads JSON files from a folder and puts them into Mongo
import "dotenv/config";                 // reads .env so we know MONGO_URI
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

// --- bring your models (make sure these paths are correct) ---
import { User } from  "../models/user.js"
import { Organization } from  "../models/organization.js"
import { Team } from  "../models/team.js"
import { Contract} from "../models/contract.js"
import { Activity } from  "../models/activity.js"
import { FinancialEntry } from  "../models/financialEntry.js"
import { Notification } from  "../models/notification.js"
import { ActivityLog } from "../models/activityLogs.js";


// ELI5: This is the order we insert so all links exist
const ORDER = [
  "users",
  "organization",
  "team",
  "contracts",
  "activities",
  "financialEntries",
  "notification",
  "activityLogs",
];

// Map names to models
const MODELS = {
  users: User,
  organization: Organization,
  team: Team,
  contracts: Contract,
  activities: Activity,
  financialEntries: FinancialEntry,
  notification: Notification,
  activityLogs: ActivityLog,
};

// Read CLI flags: --dir folder  |  --fresh (clear old first)
const DIR = (() => {
  const i = process.argv.indexOf("--dir");
  return i > -1 ? process.argv[i + 1] : "seed";
})();
const FRESH = process.argv.includes("--fresh");

// ELI5: read a JSON file if it exists, else return null
function readJSONIfExists(baseName) {
  const file = path.join(DIR, `${baseName}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

async function main() {
  const mongo = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fortis";
  console.log("🔌 Connecting to", mongo);
  await mongoose.connect(mongo);

  if (FRESH) {
    console.log("🧹 Clearing collections (dev only)...");
    // delete in reverse dependency order just to be safe
    for (const name of [...ORDER].reverse()) {
      if (!MODELS[name]) continue;
      await MODELS[name].deleteMany({});
    }
  }

  const totals = {};

  for (const name of ORDER) {
    const Model = MODELS[name];
    const data = readJSONIfExists(name);

    console.log(data)

    if (!Model) { console.log(`⏭️  No model for ${name}, skipping`); continue; }
    if (!data)   { console.log(`⏭️  ${name}.seed.json not found in ${DIR}, skipping`); continue; }
    if (!Array.isArray(data)) { console.warn(`⚠️  ${name}.seed.json must be an array`); continue; }

    // Special: if user rows have "passwordPlain", hash it to "passwordHash"
    if (name === "users") {
      const bcrypt = (await import("bcrypt")).default;
      for (const row of data) {
        if (row.passwordPlain) {
          row.passwordHash = await bcrypt.hash(row.passwordPlain, 10);
          delete row.passwordPlain;
        }
      }
    }

    // Insert many (ordered:false lets it continue if one row is duplicated)
   // Upsert by _id so re-seeding is idempotent
const ops = data.map(doc => ({
  replaceOne: { filter: { _id: doc._id }, replacement: doc, upsert: true }
}));

const result = await Model.bulkWrite(ops, { ordered: false });
const inserted = result.upsertedCount ?? 0;
const modified = (result.modifiedCount ?? 0);
console.log(`✅ Upserted into ${name}: inserted ${inserted}, replaced ${modified}`);
totals[name] = inserted + modified;
  }

  await mongoose.disconnect();
  console.log("🎉 Done seeding:", totals);
}

main().catch((e) => {
  console.error("💥 Seed error:", e);
  process.exit(1);
});
