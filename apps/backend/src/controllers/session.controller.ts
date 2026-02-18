import { env } from "@src/config/index.js";
import { AppError, cookieSessionKey } from "@src/core/index.js";
import { RequireAuthRequest } from "@src/middlewares/index.js";
import { sessionService } from "@src/service/index.js";
import { BackendDTOs } from "@src/shared/index.js";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const sessionController = {
    async create(req: Request, res: Response) {
        const data = req.body as BackendDTOs["SessionCreateDTO"];
        const result = await sessionService.create(data);

        res.cookie(cookieSessionKey, result.token, {
            maxAge: env.SESSION_COOKIE_AGE_SECONDS * 1000,
            httpOnly: true,
            sameSite: "lax",
            signed: true,
            secure: env.USING_HTTPS
        });
        return res.status(StatusCodes.NO_CONTENT).send();
    },

    async findSelf(req: Request, res: Response) {
        const authInfo = (req as RequireAuthRequest).authInfo;
        const result = await sessionService.findById(authInfo.session.id);
        if (result === null) {
            throw new AppError(StatusCodes.NOT_FOUND, "Session not found.");
        }

        const resultDto: BackendDTOs["SessionFindResponseDTO"] = {
            user: {
                id: result.user.id,
                email: result.user.email,
                privilege: result.user.privilege,
                username: result.user.username
            }
        };
        return res.status(StatusCodes.OK).json(resultDto);
    },

    async deleteSelf(req: Request, res: Response) {
        const authInfo = (req as RequireAuthRequest).authInfo;
        const result = await sessionService.deleteSelf(authInfo.user.id, authInfo.session.id);

        res.clearCookie(cookieSessionKey);

        const resultDto: BackendDTOs["SessionDeleteResponseDTO"] = result;
        return res.status(StatusCodes.OK).json(resultDto);
    }
};