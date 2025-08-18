import "dotenv/config";//A comment that shows the file’s path.
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";//Brings in Node’s file-system and path utilities so we can read JSON files from disk safely on any OS.
import { fileURLToPath } from "url";//Pulls in Mongoose so we can connect to MongoDB and write documents.
import ActivitySchema from "../models/activity.js";
import ClientSchema from "../models/client.js";


const __dirname = path.dirname(fileURLToPath(import.meta.url));//Creates a __dirname value (folder path of this file) in ESM. We’ll use it to build file paths reliably.


const read = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, "data", f), "utf-8"));
// Helper function:
// joins this folder + data + filename,
// reads that file as text,
// parses it as JSON,
// and returns the parsed array/object.
//give me activities.json


async function upsertMany(Model, docs, keys) {
  for (const d of docs) {
    const filter = keys.length ? Object.fromEntries(keys.map(k => [k, d[k]])) : { _id: d._id || undefined };
    await Model.updateOne(filter, { $set: d }, { upsert: true });
  }
}
//reads your docs and updates your model so that it can read to put it into your mongo db
// It builds a filter that identifies “the same” record:
// If you passed one or more keys (like ["email"]), it creates { email: d.email }.
// If you passed multiple keys, it makes something like { name: d.name, county: d.county }.
// Otherwise (no keys), it uses the document’s _id as the identifier.
// Then it calls updateOne with { upsert: true }:
// If a record matching the filter exists → update it with $set: d.
// If it doesn’t exist → insert it (create a new one).
//[keys]=====> WHAT MAKES A ROW UNIQUE 



(async () => {
  await mongoose.connect(process.env.MONGODB_URI);  
  await upsertMany(Client, read("clients.json"), ["name","county"]); 
  await upsertMany(Activity, read("activities.json"), ["linkedClient","when"]);  
  console.log("Seed complete");
  await mongoose.disconnect();
})();


