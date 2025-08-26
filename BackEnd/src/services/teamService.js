import { makeService } from "./baseService.js";
import { TeamRepo } from "../repositories/teamRepo.js";
export const teamService = makeService(TeamRepo);
