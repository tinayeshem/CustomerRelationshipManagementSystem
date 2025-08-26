import helmet from "helmet";                   // puts a helmet on our app
import rateLimit from "express-rate-limit";    // slows down people who knock too fast

export const useHelmet = helmet({              // set up helmet
  crossOriginResourcePolicy: { policy: "cross-origin" } // let images/files be fetched safely
});

export const limiter = rateLimit({             // set up speed limit
  windowMs: 15 * 60 * 1000,                    // time window = 15 minutes
  max: 300,                                    // allow 300 knocks per window per IP
  standardHeaders: true,                       // show rate info in headers
  legacyHeaders: false,                        // don’t use old header names
});
