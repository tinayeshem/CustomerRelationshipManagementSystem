import winston from "winston";                 // a diary tool that writes what happens

export const logger = winston.createLogger({   // make our diary
  level: "info",                               // write normal things (not too noisy)
  format: winston.format.combine(              // how we write lines
    winston.format.timestamp(),                // add time
    winston.format.simple()                    // make it simple text
  ),
  transports: [new winston.transports.Console()], // show in the terminal
});
