import { makeService } from "./baseService.js";
import { ProjectRepo } from "../repositories/projectRepo.js";

export const ProjectService = makeService(ProjectRepo);
