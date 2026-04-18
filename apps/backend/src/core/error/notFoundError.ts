import { StatusCodes } from "http-status-codes";
import { AppError } from "./appError.js";

export enum NotFoundField {
    ID = "id",
    NAME = "name",
    UUID = "uuid"
}

export class NotFoundError extends AppError {
    constructor(resourceName: string, field: NotFoundField | string, value: string | number) {
        super(
            StatusCodes.NOT_FOUND,
            `Cannot find ${resourceName} with ${field} = ${value}`,
            { field, value }
        );
    }
}