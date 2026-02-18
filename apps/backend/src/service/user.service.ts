import { LogAction, Prisma, PrivilegeLevel } from "@prisma/client";
import { AppError, canManageOtherUser, canUpdateOtherUserPrivilege, comparePassword, getNextCursor, hashPassword, isPrivilegeSettableToOther, NotFoundError, NotFoundField } from "@src/core/index.js";
import { UserCreate, UserDeleteResponse, UserManyQuery, UserManyResponse, UserPasswordUpdateSelf, UserResponse, UserUpdateOther, UserUpdateSelf } from "@src/models/index.js";
import { auditLogRepository, sessionRepository, userRepository } from "@src/repository/index.js";
import { StatusCodes } from "http-status-codes";

function toUserLog(result: Prisma.UserGetPayload<undefined>): Prisma.UserAuditLogCreateNestedOneWithoutLogInput {
    return {
        create: {
            user: { connect: { id: result.id } },
            userIdSnapshot: result.id,
            userNameSnapshot: result.username
        }
    };
}

export const userService = {
    async create(actorId: string, actorPrivilege: PrivilegeLevel, data: UserCreate): Promise<UserResponse> {
        const passwordHash = await hashPassword(data.password);

        if (!isPrivilegeSettableToOther(actorPrivilege, data.privilege)) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                "You cannot create a user with a privilege higher than yours."
            );
        }

        const result = await userRepository.create({
            username: data.username,
            email: data.email,
            passwordHash: passwordHash,
            privilege: data.privilege,
        });

        await auditLogRepository.create({
            action: LogAction.CREATE,
            actor: { connect: { id: actorId } },
            userLog: toUserLog(result)
        });

        return {
            id: result.id,
            username: result.username,
            email: result.email,
            privilege: result.privilege,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            deletedAt: result.deletedAt
        };
    },

    async findById(actorId: string, id: string): Promise<UserResponse> {
        const result = await userRepository.findById(id);
        if (result === null) throw new NotFoundError("user", NotFoundField.ID, id);

        await auditLogRepository.create({
            action: LogAction.READ,
            actor: { connect: { id: actorId } },
            userLog: toUserLog(result)
        });

        return {
            id: result.id,
            username: result.username,
            email: result.email,
            privilege: result.privilege,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            deletedAt: result.deletedAt
        };
    },

    async findMany(query: UserManyQuery): Promise<UserManyResponse> {
        const result = await userRepository.findMany(query, { cursor: query.cursor, pageSize: query.pageSize });
        return {
            list: result.map(x => ({
                ...x,
                softDeletedAt: x.deletedAt
            })),
            nextCursor: getNextCursor(result, query.pageSize)
        };
    },

    async updateOther(actorId: string, actorPrivilege: PrivilegeLevel, id: string, data: UserUpdateOther): Promise<UserResponse> {
        const user = await userRepository.findById(id);
        if (user === null) throw new NotFoundError("user", NotFoundField.ID, id);

        if (!canManageOtherUser(actorPrivilege, user.privilege)) {
            throw new AppError(
                StatusCodes.FORBIDDEN,
                "You cannot update a user who has a higher or equal privilege than you."
            );
        }

        if (data.privilege !== undefined && data.privilege !== user.privilege) {
            if (!canUpdateOtherUserPrivilege(actorPrivilege, user.privilege)) {
                throw new AppError(
                    StatusCodes.BAD_REQUEST,
                    "You cannot update a user's privilege when that user has a higher or equal privilege than you."
                );
            }

            if (!isPrivilegeSettableToOther(actorPrivilege, data.privilege)) {
                throw new AppError(
                    StatusCodes.BAD_REQUEST,
                    "You cannot update a user's privilege with a privilege higher than yours."
                );
            }
        } // TODO test


        const result = await userRepository.update(id, {
            username: data.username,
            email: data.email,
            privilege: data.privilege
        });

        await auditLogRepository.create({
            action: LogAction.UPDATE,
            actor: { connect: { id: actorId } },
            userLog: toUserLog(result)
        });


        return {
            id: result.id,
            username: result.username,
            email: result.email,
            privilege: result.privilege,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            deletedAt: result.deletedAt
        };
    },

    async updateSelf(actorId: string, data: UserUpdateSelf): Promise<UserResponse> {
        const result = await userRepository.update(actorId, {
            username: data.username,
            email: data.email,
        });

        await auditLogRepository.create({
            action: LogAction.UPDATE,
            actor: { connect: { id: actorId } },
            userLog: toUserLog(result)
        });

        return {
            id: result.id,
            username: result.username,
            email: result.email,
            privilege: result.privilege,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            deletedAt: result.deletedAt
        };
    },

    async passwordUpdateSelf(actorId: string, data: UserPasswordUpdateSelf): Promise<UserResponse> {
        const initial = await userRepository.findById(actorId);
        if (initial === null) throw new NotFoundError("user", NotFoundField.ID, actorId);

        const isCorrectPassword = await comparePassword(
            data.currentPassword,
            initial.passwordHash
        );
        if (!isCorrectPassword) throw new AppError(StatusCodes.UNAUTHORIZED, "Incorrect password.");

        const result = await userRepository.update(actorId, {
            passwordHash: await hashPassword(data.newPassword)
        });

        await auditLogRepository.create({
            action: LogAction.UPDATE,
            actor: { connect: { id: actorId } },
            userLog: toUserLog(result)
        });

        return {
            id: result.id,
            username: result.username,
            email: result.email,
            privilege: result.privilege,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            deletedAt: result.deletedAt
        };
    },

    async softDelete(actorId: string, actorPrivilege: PrivilegeLevel, id: string): Promise<UserDeleteResponse> {
        if (actorId === id) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Cannot delete yourself.");
        }

        const user = await userRepository.findById(id);
        if (user === null) throw new NotFoundError("user", NotFoundField.ID, id);

        if (!canManageOtherUser(actorPrivilege, user.privilege)) {
            throw new AppError(
                StatusCodes.FORBIDDEN,
                "You cannot delete a user who has a higher or equal privilege than you."
            );
        }

        if (user.privilege === PrivilegeLevel.ADMIN) {
            const adminCount = await userRepository.countActiveAdmin();
            if (adminCount <= 1) {
                throw new AppError(StatusCodes.BAD_REQUEST, "Cannot delete the only remaining admin user.");
            }
        }

        const result = await userRepository.softDelete(id);
        if (result.deletedAt === null) throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to soft delete user");

        await sessionRepository.deleteAllFromUser(result.id);

        await auditLogRepository.create({
            action: LogAction.SOFT_DELETE,
            actor: { connect: { id: actorId } },
            userLog: toUserLog(result)
        });

        return {
            id: result.id,
            username: result.username,
            deletedAt: result.deletedAt
        };
    },

    async softDeleteSelf(actorId: string, actorPrivilege: PrivilegeLevel) {
        if (actorPrivilege === PrivilegeLevel.ADMIN) {
            const adminCount = await userRepository.countActiveAdmin();
            if (adminCount <= 1) {
                throw new AppError(StatusCodes.BAD_REQUEST, "Cannot delete the only remaining admin user.");
            }
        }

        const result = await userRepository.softDelete(actorId);
        if (result.deletedAt === null) throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to soft delete user");

        await sessionRepository.deleteAllFromUser(result.id);

        await auditLogRepository.create({
            action: LogAction.SOFT_DELETE,
            actor: { connect: { id: actorId } },
            userLog: toUserLog(result)
        });

        return {
            id: result.id,
            username: result.username,
            deletedAt: result.deletedAt
        };
    }
};