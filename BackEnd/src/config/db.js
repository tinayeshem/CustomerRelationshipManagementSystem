import mongoose from "mongoose"; 


export async function connectDB() {
  
    const uri = process.env.MONGO_URI  // local now, cloud later
    if (!uri) throw new Error("MONGO_URI missing");

    //connect and test 

    await mongoose.connect(
        uri,
        {autoIndex: true} // good for dev; set false in prod if you prefer
    )

    

    const conn = mongoose.connection;
const dbName =
  conn?.name || conn?.db?.databaseName || new URL(process.env.MONGO_URI).pathname.slice(1) || "(unknown)";
const host =
  conn?.host ||
  conn?.client?.s?.url ||
  (new URL(process.env.MONGO_URI).host) ||
  "(unknown)";

console.log(`✅ Mongo connected → db="${dbName}" host="${host}"`);

  //catch err and handle 

  mongoose.connection.on("error", err => console.error("Mongo error:", err));
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🔌 Mongo disconnected");
    process.exit(0);
  });


}

