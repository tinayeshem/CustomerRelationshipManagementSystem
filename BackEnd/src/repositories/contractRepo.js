import {makeRepo} from "./BaseRepository.js";
import {Contract} from "../models/contract.js";
export const ActivityRepo = makeRepo(Contract);