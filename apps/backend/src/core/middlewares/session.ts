import { Request, Response, NextFunction } from "express";
import { destructureSessionToken } from "../service/index.js";

export type SessionTokenRequest = Request & { 
    sessionToken?: {
        id: string;
        secret: string;
    };
};

export const cookieSessionKey = "sessionId";

export async function sessionIdParse(req: Request, res: Response, next: NextFunction) {
    (req as unknown as SessionTokenRequest).sessionToken = undefined;

    const rawSessionToken = req.signedCookies[cookieSessionKey] || req.headers['authorization'];
    if (!rawSessionToken) return next();

    const session = destructureSessionToken(rawSessionToken);

    (req as unknown as SessionTokenRequest).sessionToken = session;
    return next();
}