import { makeService } from "./baseService.js";
import { FinancialEntryRepo } from "../repositories/ActivityRepo.js";
export const FinancialEntryService = makeService(FinancialEntryRepo);
