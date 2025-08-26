import { makeService } from "./baseService.js";
import { contractRepo } from "../repositories/contractRepo.js";
export const contractService = makeService(contractRepo);
