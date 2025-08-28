import { makeService } from "./baseService.js";
import { ProjectRepo } from "../repositories/projectRepo.js";
import { ActivityLog } from "../models/activityLogs.js";

// Base service with additional methods for audit logging
const baseProjectService = makeService(ProjectRepo);

export const ProjectService = {
  ...baseProjectService,

  // Enhanced update method that tracks stage changes
  update: async (id, dto, userId = null) => {
    try {
      // Get current project state before update
      const currentProject = await ProjectRepo.get(id);
      if (!currentProject) {
        throw new Error('Project not found');
      }

      // Perform the update
      const updatedProject = await ProjectRepo.update(id, dto);

      // Check if stage-related fields changed and log if userId provided
      if (userId) {
        await trackProjectChanges(currentProject, updatedProject, userId);
      }

      return updatedProject;
    } catch (error) {
      throw error;
    }
  },

  // Dedicated method for stage transitions with automatic audit logging
  changeStage: async (projectId, newStage, userId) => {
    try {
      const currentProject = await ProjectRepo.get(projectId);
      if (!currentProject) {
        throw new Error('Project not found');
      }

      const oldStage = currentProject.currentStage;

      // Update the project stage
      const updatedProject = await ProjectRepo.update(projectId, {
        currentStage: newStage
      });

      // Create audit log entry for stage change
      await ActivityLog.create({
        entityType: 'Project',
        entityId: projectId,
        action: 'stage_changed',
        changedBy: userId,
        before: { currentStage: oldStage },
        after: { currentStage: newStage },
        message: `Stage changed from "${oldStage}" to "${newStage}"`
      });

      return updatedProject;
    } catch (error) {
      throw error;
    }
  },

  // Method to advance project to next stage
  advanceStage: async (projectId, userId) => {
    try {
      const project = await ProjectRepo.get(projectId);
      if (!project) {
        throw new Error('Project not found');
      }

      const stageOrder = ["Meeting", "Call", "Negotiation", "Contract", "Implementation", "Review", "Completed"];
      const currentIndex = stageOrder.indexOf(project.currentStage);

      if (currentIndex === -1 || currentIndex >= stageOrder.length - 1) {
        throw new Error('Cannot advance stage further');
      }

      const nextStage = stageOrder[currentIndex + 1];
      return await ProjectService.changeStage(projectId, nextStage, userId);
    } catch (error) {
      throw error;
    }
  },

  // Method to go back to previous stage
  goBackStage: async (projectId, userId) => {
    try {
      const project = await ProjectRepo.get(projectId);
      if (!project) {
        throw new Error('Project not found');
      }

      const stageOrder = ["Meeting", "Call", "Negotiation", "Contract", "Implementation", "Review", "Completed"];
      const currentIndex = stageOrder.indexOf(project.currentStage);

      if (currentIndex <= 0) {
        throw new Error('Cannot go back to previous stage');
      }

      const previousStage = stageOrder[currentIndex - 1];
      return await ProjectService.changeStage(projectId, previousStage, userId);
    } catch (error) {
      throw error;
    }
  },

  // Get audit trail for a project
  getAuditTrail: async (projectId) => {
    try {
      const auditLogs = await ActivityLog.find({
        entityType: 'Project',
        entityId: projectId
      })
      .populate('changedBy', 'name email')
      .sort({ at: -1 })
      .lean();

      return auditLogs;
    } catch (error) {
      throw error;
    }
  }
};

// Helper function to track general project changes
async function trackProjectChanges(beforeProject, afterProject, userId) {
  const changes = [];

  // Track currentStage changes
  if (beforeProject.currentStage !== afterProject.currentStage) {
    changes.push({
      entityType: 'Project',
      entityId: afterProject._id,
      action: 'stage_changed',
      changedBy: userId,
      before: { currentStage: beforeProject.currentStage },
      after: { currentStage: afterProject.currentStage },
      message: `Stage changed from "${beforeProject.currentStage}" to "${afterProject.currentStage}"`
    });
  }

  // Track status changes
  if (beforeProject.status !== afterProject.status) {
    changes.push({
      entityType: 'Project',
      entityId: afterProject._id,
      action: 'status_changed',
      changedBy: userId,
      before: { status: beforeProject.status },
      after: { status: afterProject.status },
      message: `Status changed from "${beforeProject.status}" to "${afterProject.status}"`
    });
  }

  // Track assignedMembers changes
  if (JSON.stringify(beforeProject.assignedMembers) !== JSON.stringify(afterProject.assignedMembers)) {
    changes.push({
      entityType: 'Project',
      entityId: afterProject._id,
      action: 'assigned',
      changedBy: userId,
      before: { assignedMembers: beforeProject.assignedMembers },
      after: { assignedMembers: afterProject.assignedMembers },
      message: 'Project team members updated'
    });
  }

  // Create all audit log entries
  if (changes.length > 0) {
    await ActivityLog.insertMany(changes);
  }
}
