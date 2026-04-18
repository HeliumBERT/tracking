import { backendSchemas } from "@src/shared/index.js";
import { NextFunction, Request, Response } from "express";

export async function userCreateParse(req: Request, res: Response, next: NextFunction) {
    req.body = backendSchemas.UserCreateDTO.parse(req.body);
    return next();
}

export async function userUpdateOtherParse(req: Request, res: Response, next: NextFunction) {
    req.body = backendSchemas.UserUpdateOtherDTO.parse(req.body);
    return next();
}

export async function userUpdateSelfParse(req: Request, res: Response, next: NextFunction) {
    req.body = backendSchemas.UserUpdateSelfDTO.parse(req.body);
    return next();
}
export async function userPasswordUpdateSelfParse(req: Request, res: Response, next: NextFunction) {
    req.body = backendSchemas.UserPasswordUpdateSelfDTO.parse(req.body);
    return next();
}