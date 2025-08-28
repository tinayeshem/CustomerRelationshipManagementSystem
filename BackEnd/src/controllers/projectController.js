import { ProjectService } from "../services/projectService.js";
import { makeController } from "./baseControllers.js";

// Base controller with additional methods for stage management
const baseController = {
  create: async (req, res, next) => {
    try {
      const result = await ProjectService.create(req.body);
      res.status(201).json({ ok: true, data: result });
    } catch (e) {
      next(e);
    }
  },

  get: async (req, res, next) => {
    try {
      const result = await ProjectService.get(req.params.id);
      if (!result) return res.status(404).json({ ok: false, error: "Not found" });
      res.json({ ok: true, data: result });
    } catch (e) {
      next(e);
    }
  },

  list: async (req, res, next) => {
    try {
      const result = await ProjectService.list(req.query);
      res.json({ ok: true, data: result });
    } catch (e) {
      next(e);
    }
  },

  update: async (req, res, next) => {
    try {
      const userId = req.user?._id || req.user?.id;
      const result = await ProjectService.update(req.params.id, req.body, userId);
      res.json({ ok: true, data: result });
    } catch (e) {
      next(e);
    }
  },

  remove: async (req, res, next) => {
    try {
      await ProjectService.remove(req.params.id);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  }
};

export const ProjectController = {
  ...baseController,

  // Change project stage with audit logging
  changeStage: async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const { newStage } = req.body;
      const userId = req.user?._id || req.user?.id;

      if (!userId) {
        return res.status(401).json({ ok: false, error: "User ID required for audit logging" });
      }

      if (!newStage) {
        return res.status(400).json({ ok: false, error: "New stage is required" });
      }

      const result = await ProjectService.changeStage(projectId, newStage, userId);
      res.json({ ok: true, data: result });
    } catch (e) {
      next(e);
    }
  },

  // Advance project to next stage
  advanceStage: async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const userId = req.user?._id || req.user?.id;

      if (!userId) {
        return res.status(401).json({ ok: false, error: "User ID required for audit logging" });
      }

      const result = await ProjectService.advanceStage(projectId, userId);
      res.json({ ok: true, data: result });
    } catch (e) {
      next(e);
    }
  },

  // Go back to previous stage
  goBackStage: async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const userId = req.user?._id || req.user?.id;

      if (!userId) {
        return res.status(401).json({ ok: false, error: "User ID required for audit logging" });
      }

      const result = await ProjectService.goBackStage(projectId, userId);
      res.json({ ok: true, data: result });
    } catch (e) {
      next(e);
    }
  },

  // Get audit trail for a project
  getAuditTrail: async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const auditTrail = await ProjectService.getAuditTrail(projectId);
      res.json({ ok: true, data: auditTrail });
    } catch (e) {
      next(e);
    }
  }
};
