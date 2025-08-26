// BackEnd/src/repositories/ClientRepository.js
import {makeRepo} from "./BaseRepository.js";
import { Organization } from "../models/organization.js";

export const OrganizationRepo = makeRepo(Organization);

