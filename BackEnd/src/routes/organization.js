import { Router } from "express";
import { OrganizationController } from "../controllers/OrganizationController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// All organization routes require authentication
router.use(authenticate);

// GET /api/organizations - List all organizations with filtering
router.get("/", OrganizationController.list);

// GET /api/organizations/:id - Get specific organization by ID
router.get("/:id", OrganizationController.get);

// POST /api/organizations - Create new organization
router.post("/", OrganizationController.create);

// PUT /api/organizations/:id - Update organization
router.put("/:id", OrganizationController.update);

// DELETE /api/organizations/:id - Delete organization
router.delete("/:id", OrganizationController.remove);

export default router;
