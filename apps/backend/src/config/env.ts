import "dotenv/config";
import { parseEnvironmentVariables } from "@absxn/process-env-parser";

const result = parseEnvironmentVariables({
    DATABASE_URL: {},
    SESSION_INACTIVITY_TIMEOUT_SECONDS: {
        parser: parseInt,
        default: 60 * 60 * 24 * 1 // 1 day
    },
    SESSION_ACTIVITYCHECK_INTERVAL_SECONDS: {
        parser: parseInt,
        default: 60 * 60 // 1 hour
    },
    SESSION_COOKIE_AGE_SECONDS: {
        parser: parseInt,
        default: 60 * 60 * 24 * 7 // 7 days
    },
    COOKIE_SECRET: {},
    DEVELOPMENT_MODE: { parser: x => x === "true", default: false },
});

if (!result.success) throw new Error("Invalid .env file, or you didn't make one yet.");

export const env = result.env;