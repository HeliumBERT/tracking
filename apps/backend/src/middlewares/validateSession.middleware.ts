import { PrivilegeLevel } from "@prisma/client";
import { SessionTokenRequest } from "@src/core/index.js";
import { sessionService } from "@src/service/index.js";
import { Request, Response, NextFunction } from "express";

export interface ResolveResult {
    session: {
        id: string;
        secretHash: string;
        createdAt: Date;
        lastVerifiedAt: Date;
    };
    user: {
        id: string;
        privilege: PrivilegeLevel;
    };
}

export type ResolvedSessionRequest = Request & {
    resolveResult?: ResolveResult;
}

export async function validateSession(req: Request, res: Response, next: NextFunction) {
    const sessionToken = (req as SessionTokenRequest).sessionToken;
    if (!sessionToken) {
        (req as ResolvedSessionRequest).resolveResult = undefined;
        return next();
    }

    const result = await sessionService.validateSession(sessionToken.id, sessionToken.secret);
    if (result === null) {
        (req as ResolvedSessionRequest).resolveResult = undefined;
        return next();
    }

    const deletedUser = result.user.deletedAt !== null;
    if (deletedUser) {
        (req as ResolvedSessionRequest).resolveResult = undefined;
        return next();
    }

    const retypedReq = req as ResolvedSessionRequest;
    retypedReq.resolveResult = {
        session: {
            id: result.id,
            createdAt: result.createdAt,
            lastVerifiedAt: result.lastVerifiedAt,
            secretHash: result.secretHash
        },
        user: {
            id: result.user.id,
            privilege: result.user.privilege
        }
    };

    return next();
}