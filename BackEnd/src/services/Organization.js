// BackEnd/src/services/ClientService.js
import { makeService } from "./baseService.js";
import { OrganizationRepo } from "../repositories/OrganizationRepo.js";
export const OrganizationService = makeService(OrganizationRepo);
