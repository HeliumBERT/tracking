import { NextFunction, Request, Response } from "express";
import { AppError } from "../error/index.js";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { error as OpenApiError } from "express-openapi-validator";
import fs from "fs";

function parseGeneralError(err: Error): AppError | Error {
    // if (err instanceof Prisma.PrismaClientKnownRequestError) {
    //     if (err.code === "P2002") {
    //         // Unique constraint failed
    //         return new AppError(
    //             StatusCodes.CONFLICT,
    //             "The provided data conflicts with existing data.",
    //             { field: err.meta?.target, value: err.meta?.value }
    //         );
    //     }

    //     if (err.code === "P2003") {
    //         // Foreign key constraint failed
    //         return new AppError(
    //             StatusCodes.BAD_REQUEST,
    //             "The provided data references a non-existent record.",
    //             { field: err.meta?.field_name, value: err.meta?.value }
    //         );
    //     }

    //     if (err.code === "P2025") {
    //         // Record not found
    //         return new AppError(
    //             StatusCodes.NOT_FOUND,
    //             "The requested record was not found.",
    //             { cause: err.meta?.cause }
    //         );
    //     }

    //     return new AppError(
    //         StatusCodes.INTERNAL_SERVER_ERROR,
    //         "A database error occurred.",
    //         { code: err.code, message: err.message }
    //     );
    // }


    // if (err instanceof z.ZodError) {
    //     return new AppError(
    //         StatusCodes.BAD_REQUEST,
    //         "Data parsing failed. Make sure you are sending the correct data format.",
    //         {
    //             errors: err.errors.map(issue => ({
    //                 path: issue.path.join("."),
    //                 message: issue.message
    //             }))
    //         }
    //     );
    // }

    return err;
}

function handleFileUploadError(files: unknown | undefined) {
    if (
        files === undefined ||
        files === null ||
        !Array.isArray(files) ||
        files.length === 0
    ) return;

    for (const file of files) {
        if (file === undefined || file === null) continue;
        if (typeof file.path !== "string") continue;

        fs.unlinkSync(file.path);
    }
}

export async function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
    const files = req.files as Express.Multer.File[] | undefined;
    handleFileUploadError(files);

    if (
        err instanceof OpenApiError.BadRequest||
        err instanceof OpenApiError.UnsupportedMediaType ||
        err instanceof OpenApiError.RequestEntityTooLarge
    ) {
        return res.status(err.status).json({
            message: err.message,
            errors: err.errors,
        });
    }

    if (err instanceof OpenApiError.NotFound) {
        return res.status(err.status).json({
            message: "Invalid route."
        });
    }

    if (err instanceof Error) {
        const parsedError = parseGeneralError(err);

        if (parsedError instanceof AppError) {
            return res.status(parsedError.statusCode).json({
                message: parsedError.message,
                moreInfo: parsedError.moreInfo
            });
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: parsedError.message });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
}