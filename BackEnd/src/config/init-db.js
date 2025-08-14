import "./env.js";
import mongoose from "mongoose";
import { connectDB } from "../db.js";
import  "../models/server.js"



export async function main() {
  await connectDB();

  // 1) ensure collections exist
  await Promise.all([
    User.createCollection(),
    Team.createCollection(),
    Client.createCollection(),
    LRSU.createCollection(),
    Activity.createCollection(),
    Contract.createCollection(),
    Report.createCollection(),
    Notification.createCollection(),
    Finance.createCollection(),
  ]);

  // 2) sync indexes (build or update them to match your schema)
  await Promise.all([
    User.syncIndexes(),
    Team.syncIndexes(),
    Client.syncIndexes(),
    LRSU.syncIndexes(),
    Activity.syncIndexes(),
    Contract.syncIndexes(),
    Report.syncIndexes(),
    Notification.syncIndexes(),
    Finance.syncIndexes(),
  ]);

  console.log("✅ Collections ready & indexes synced");
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
