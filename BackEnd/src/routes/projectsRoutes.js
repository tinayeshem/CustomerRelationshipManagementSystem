import { Router } from "express";
import { ProjectController } from "../controllers/projectController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// All project routes require authentication
router.use(authenticate);

// GET /api/projects - List all projects with filtering
router.get("/", ProjectController.list);

// GET /api/projects/:id - Get specific project by ID
router.get("/:id", ProjectController.get);

// POST /api/projects - Create new project
router.post("/", ProjectController.create);

// PUT /api/projects/:id - Update project
router.put("/:id", ProjectController.update);

// DELETE /api/projects/:id - Delete project
router.delete("/:id", ProjectController.remove);

export default router;
