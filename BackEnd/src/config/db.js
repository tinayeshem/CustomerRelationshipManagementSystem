import mongoose from "mongoose"; 
import dotenv from "dotenv";

dotenv.config(); // loads .env if present

export async function connectDB() {
  
    const uri = process.env.MONGO_URI  // local now, cloud later
    if (!uri) throw new Error("MONGO_URI missing");cd

    //connect and test 

    mongoose.connect(
        uri,
        {autoIndex: true} // good for dev; set false in prod if you prefer
    )

    console.log(
    "✅ Mongo connected",
    { db: mongoose.connection.name, host: mongoose.connection.host }
  );

  //catch err and handle 

  mongoose.connection.on("error", err => console.error("Mongo error:", err));
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🔌 Mongo disconnected");
    process.exit(0);
  });


}

