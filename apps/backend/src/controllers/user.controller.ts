import { UuidRequest } from "@src/core/index.js";
import { RequireAuthRequest } from "@src/middlewares/index.js";
import { UserManyQuery, UserManyQueryRaw, UserResponse } from "@src/models/index.js";
import { dateToString } from "@src/parsers/index.js";
import { userService } from "@src/service/index.js";
import { BackendDTOs } from "@src/shared/index.js";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


function toUserResponseDto(result: UserResponse): BackendDTOs["UserResponseDTO"] {
    return {
        ...result,
        createdAt: dateToString(result.createdAt),
        updatedAt: dateToString(result.updatedAt),
        deletedAt: result.deletedAt instanceof Date ? dateToString(result.deletedAt) : result.deletedAt
    };
}


export const userController = {
    async create(req: Request, res: Response) {
        const authInfo = (req as RequireAuthRequest).authInfo;
        const data = req.body as BackendDTOs["UserCreateDTO"];
        const result = await userService.create(authInfo.user.id, authInfo.user.privilege, data);

        const resultDto = toUserResponseDto(result);
        return res.status(StatusCodes.OK).json(resultDto);
    },

    async findById(req: Request, res: Response) {
        const authInfo = (req as RequireAuthRequest).authInfo;
        const id = (req as UuidRequest).uuids[0];
        const result = await userService.findById(authInfo.user.id, id);

        const resultDto = toUserResponseDto(result);
        return res.status(StatusCodes.OK).json(resultDto);
    },

    async findMany(req: Request, res: Response) {
        const queryRaw = req.query as UserManyQueryRaw;
        const query: UserManyQuery = queryRaw;
        const result = await userService.findMany(query);

        const resultDto: BackendDTOs["UserManyResponseDTO"] = {
            list: result.list.map(x => ({
                ...x,
                createdAt: dateToString(x.createdAt),
                updatedAt: dateToString(x.updatedAt),
                deletedAt: x.deletedAt instanceof Date ? dateToString(x.deletedAt) : x.deletedAt
            })),
            nextCursor: result.nextCursor
        };
        return res.status(StatusCodes.OK).json(resultDto);
    },

    async updateOther(req: Request, res: Response) {
        const authInfo = (req as RequireAuthRequest).authInfo;
        const id = (req as UuidRequest).uuids[0];
        const data = req.body as BackendDTOs["UserUpdateOtherDTO"];
        const result = await userService.updateOther(authInfo.user.id, authInfo.user.privilege, id, data);

        const resultDto = toUserResponseDto(result);
        return res.status(StatusCodes.OK).json(resultDto);
    },

    async updateSelf(req: Request, res: Response) {
        const authInfo = (req as RequireAuthRequest).authInfo;

        const data = req.body as BackendDTOs["UserUpdateSelfDTO"];
        const result = await userService.updateSelf(authInfo.user.id, data);

        const resultDto = toUserResponseDto(result);
        return res.status(StatusCodes.OK).json(resultDto);
    },

    async passwordUpdateSelf(req: Request, res: Response) {
        const authInfo = (req as RequireAuthRequest).authInfo;

        const data = req.body as BackendDTOs["UserPasswordUpdateSelfDTO"];
        const result = await userService.passwordUpdateSelf(authInfo.user.id, data);

        const resultDto = toUserResponseDto(result);
        return res.status(StatusCodes.OK).json(resultDto);
    },

    async softDeleteOther(req: Request, res: Response) {
        const authInfo = (req as RequireAuthRequest).authInfo;
        const id = (req as UuidRequest).uuids[0];
        const result = await userService.softDelete(authInfo.user.id, authInfo.user.privilege, id);

        const resultDto: BackendDTOs["UserDeleteResponseDTO"] = {
            ...result,
            deletedAt: dateToString(result.deletedAt)
        };
        res.status(StatusCodes.OK).json(resultDto);
    },

    async softDeleteSelf(req: Request, res: Response) {
        const authInfo = (req as RequireAuthRequest).authInfo;
        const result = await userService.softDeleteSelf(authInfo.user.id, authInfo.user.privilege);

        const resultDto: BackendDTOs["UserDeleteResponseDTO"] = {
            ...result,
            deletedAt: dateToString(result.deletedAt)
        };
        res.status(StatusCodes.OK).json(resultDto);
    }
};