import {makeRepo} from "./BaseRepository.js";
import {FinancialEntry} from "../models/financialEntry.js";
export const FinancialEntryRepo = makeRepo(FinancialEntry);