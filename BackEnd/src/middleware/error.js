import { logger } from "../config/logger.js";  // we write errors in our diary

export function notFound(_req, res) {          // when the path doesn’t exist
  res.status(404).json({ ok:false, error:"Not found" }); // say “not found”
}

export function errorHandler(err, _req, res, _next) { // when anything breaks
  logger.error(err.stack || err.message);      // write what broke
  res.status(err.status || 500)                // choose a number (500 if unknown)
     .json({ ok:false, error: err.message || "Server error" }); // tell the caller
}
