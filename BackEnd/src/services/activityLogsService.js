import { makeService } from "./baseService.js";
import { ActivityLogRepo } from "../repositories/activityLogRepo.js";
export const ActivitLogService = makeService(ActivityLogRepo);
