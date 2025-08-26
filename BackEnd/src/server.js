import "./config/env.js";                   // loads env vars (works with or without dotenv-cli)
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import "./models/index.js";
import organization from "./routes/organization.js";
import activitiesRouter from "./routes/activitiesRoutes.js";
//others waiting to be implemented 
import { env } from "./config/env.js";      // our secret notes
import { logger } from "./config/logger.js";// our diary
import { useHelmet, limiter } from "./middleware/security.js"; // helmet + speed limit
//import { notFound, errorHandler } from "./middleware/errorHandler.js"; // nice errors
import routes from "./routes/index.js"; 



const app = express();//create the app
app.use(helmet) // wear a helmet
app.use(limiter);  // set speed limit
app.use(cors({ origin: true, credentials: true })); // allow cross-site with cookies
app.use(cookieParser());                        // read cookies
app.use(express.json({ limit: "1mb" }));        // read JSON bodies up to 1 MB
app.use(morgan("dev"));                         // log requests (pretty)
app.use(express.json());


// quick health route
app.get("/api/health", (req, res) => {
  res.json({ ok: true, mongo: !!process.env.MONGO_URI });
});

app.use("/api",routes)

app.use(notFound);                              // if no road matches, say 404
app.use(errorHandler);                          // if something blows up, handle it


// connect to Mongo, then start HTTP server
await connectDB();

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, () => console.log(`🚀 API listening on :${PORT}`))