import { Request, Response, NextFunction } from "express";
import { AppError } from "../error/index.js";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export type IdRequest = Request & { parsedId: number };

const idSchema = z.string().min(1)
    .transform(x => parseInt(x)).pipe(
        z.number().int().min(1)
    );

export async function idParser(req: Request, res: Response, next: NextFunction) {
    const result = await idSchema.safeParseAsync(req.params.id);
    if (!result.success) throw new AppError(StatusCodes.BAD_REQUEST, "Invalid ID format");

    (req as unknown as IdRequest).parsedId = result.data;
    next();
}


export type UuidRequest = Request & { uuids: string[] };
const uuidSchema = z.string().uuid();

export function uuidRouteParam(paramName: string = "uuid") {
    return async (req: Request, res: Response, next: NextFunction) => {
        const result = await uuidSchema.safeParseAsync(req.params[paramName]);
        if (!result.success) throw new AppError(StatusCodes.BAD_REQUEST, "Invalid UUID format");

        const typedReq = req as unknown as UuidRequest;
        if (typedReq.uuids === undefined) typedReq.uuids = [];
        typedReq.uuids.push(result.data);
        next();
    };
}