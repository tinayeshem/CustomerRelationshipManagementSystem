// BackEnd/src/repositories/ActivityRepository.js
import {makeRepo} from "./BaseRepository.js";
import {Activity} from "../models/activity.js";
export const ActivityRepo = makeRepo(Activity);
