import { schemas } from "@repo/backend-contract";
import { NextFunction, Request, Response } from "express";

export async function userCreateParse(req: Request, res: Response, next: NextFunction) {
    req.body = schemas.UserCreateDTO.parse(req.body);
    return next();
}

export async function userUpdateOtherParse(req: Request, res: Response, next: NextFunction) {
    req.body = schemas.UserUpdateOtherDTO.parse(req.body);
    return next();
}

export async function userUpdateSelfParse(req: Request, res: Response, next: NextFunction) {
    req.body = schemas.UserUpdateSelfDTO.parse(req.body);
    return next();
}
export async function userPasswordUpdateSelfParse(req: Request, res: Response, next: NextFunction) {
    req.body = schemas.UserPasswordUpdateSelfDTO.parse(req.body);
    return next();
}