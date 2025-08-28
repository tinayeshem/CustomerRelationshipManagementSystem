import { makeRepo } from "./BaseRepository.js";
import { Project } from "../models/project.js";

export const ProjectRepo = makeRepo(Project);
