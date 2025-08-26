import {makeRepo} from "./BaseRepository.js";
import {ActivitLog, ActivityLog} from "../models/activityLogs.js";
export const ActivityLogRepo = makeRepo(ActivityLog);