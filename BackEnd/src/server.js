import "./config/env.js";                   // loads env vars (works with or without dotenv-cli)
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import "./models/index.js";
import clientsRouter from "./routes/clientsRoutes.js";
import activitiesRouter from "./routes/activitiesRoutes.js";
//others waiting to be implemented 

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"], credentials: true }));
app.use(express.json());
app.use(morgan("dev"));






// quick health route
app.get("/api/health", (req, res) => {
  res.json({ ok: true, mongo: !!process.env.MONGO_URI });
});

app.use("/api/clients", clientsRouter);
app.use("/api/activities", activitiesRouter);




// connect to Mongo, then start HTTP server
await connectDB();

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, () => console.log(`🚀 API listening on :${PORT}`))