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

// Stage transition endpoints with audit logging
// POST /api/projects/:projectId/change-stage - Change to specific stage
router.post("/:projectId/change-stage", ProjectController.changeStage);

// POST /api/projects/:projectId/advance-stage - Advance to next stage
router.post("/:projectId/advance-stage", ProjectController.advanceStage);

// POST /api/projects/:projectId/go-back-stage - Go back to previous stage
router.post("/:projectId/go-back-stage", ProjectController.goBackStage);

// GET /api/projects/:projectId/audit-trail - Get audit trail for project
router.get("/:projectId/audit-trail", ProjectController.getAuditTrail);

export default router;
