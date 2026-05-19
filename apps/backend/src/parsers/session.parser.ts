import { schemas } from "@repo/backend-contract";
import { NextFunction, Request, Response } from "express";

export async function sessionCreateParse(req: Request, res: Response, next: NextFunction) {
    req.body = schemas.SessionCreateDTO.parse(req.body);
    next();
}