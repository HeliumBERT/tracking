import { sessionController } from "@src/controllers/index.js";
import { jsonParser } from "@src/core/index.js";
import { checkPrivilegeMiddleware, requireAuth } from "@src/middlewares/index.js";
import { sessionCreateParse } from "@src/parsers/index.js";
import { Router } from "express";

export const sessionRouter = Router();

sessionRouter.use(...jsonParser);

sessionRouter.post("/", sessionCreateParse, sessionController.create);
sessionRouter.get("/current", requireAuth, sessionController.findSelf);
sessionRouter.delete("/current", requireAuth, sessionController.deleteSelf);

sessionRouter.get("/auditLogs",
    checkPrivilegeMiddleware('ADMIN'),
);