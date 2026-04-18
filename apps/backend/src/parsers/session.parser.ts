import { backendSchemas } from "@src/shared/index.js";
import { NextFunction, Request, Response } from "express";

export async function sessionCreateParse(req: Request, res: Response, next: NextFunction) {
    req.body = backendSchemas.SessionCreateDTO.parse(req.body);
    next();
}