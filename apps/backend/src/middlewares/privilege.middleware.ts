import { Request, Response, NextFunction } from "express";
import { AppError } from "@src/core/index.js";
import { StatusCodes } from "http-status-codes";
import { userRepository } from "@src/repository/index.js";
import { RequireAuthRequest } from "./requireAuth.middleware.js";
import { checkMinPrivilege, PrivilegeLevel } from "@src/core/service/permission.js";

export function checkPrivilegeMiddleware(minPrivilegeLevel: PrivilegeLevel) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as RequireAuthRequest).authInfo.user.id;
        if (!userId) {
            throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized, not logged in.");
        }

        const user = await userRepository.findById(userId);
        if (!user) {
            throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized, not logged in.");
        }

        if (!checkMinPrivilege(user.privilege, minPrivilegeLevel)) {
            throw new AppError(StatusCodes.FORBIDDEN, "Insufficient privileges.");
        }

        return next();
    };
}