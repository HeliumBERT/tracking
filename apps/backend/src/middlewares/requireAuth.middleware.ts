import { AppError } from "@src/core/index.js";
import { ResolvedSessionRequest, ResolveResult } from "./validateSession.middleware.js";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export type RequireAuthRequest = Request & {
    authInfo: ResolveResult;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const retypedReq = req as ResolvedSessionRequest;
    if (!retypedReq.resolveResult) {
        throw new AppError(StatusCodes.FORBIDDEN, "Authentication required.");
    }

    (req as RequireAuthRequest).authInfo = retypedReq.resolveResult;

    return next();
}