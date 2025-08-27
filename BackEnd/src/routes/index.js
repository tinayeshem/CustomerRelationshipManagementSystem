// src/routes/index.js
import { Router } from "express";

// 🔐 auth (email/password) and 🔐 Google OAuth
import auth from "./auth/authRoute.js";
import oauth from "./auth/oauthRoute.js";

// 📇 business routes
import organization from "./organization.js";
import team from "./teamRoute.js";
import activity from "./activitiesRoutes.js";
import contract from "./contractsRoutes.js";
import project from "./projectsRoutes.js";
import financialEntry from "./financialEntryRoute.js";
import notification from "./notificationRoutes.js";

// 📤 uploads + 🤖 AI helper
import upload from "./upload.routes.js";
import ai from "./ai.routes.js";

// 🛠️ optional: test-only scripts (e.g., trigger cron once)
// If you didn't create this yet, you can delete these two lines.
const r = Router();

// 🔐 auth endpoints live at /api/auth/...
r.use("/auth", auth);     // /api/auth/register, /api/auth/login, /api/auth/me
r.use("/auth", oauth);    // /api/auth/google, /api/auth/google/callback

// 📇 main app resources
r.use("/organizations", organization);       // /api/organizations/...
r.use("/teams", team);                       // /api/teams/...
r.use("/activities", activity);              // /api/activities/...
r.use("/contracts", contract);               // /api/contracts/...
r.use("/projects", project);                 // /api/projects/...
r.use("/financial-entries", financialEntry); // /api/financial-entries/...
r.use("/notifications", notification);       // /api/notifications/...

// 📤 files and 🤖 AI
r.use("/upload", upload); // /api/upload
r.use("/ai", ai);         // /api/ai/suggest-next-step

// 🛠️ optional utilities
// r.use("/scripts", scripts); // /api/scripts/run-renewal-check (admin-only helper)

export default r;
