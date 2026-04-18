import { LogAction, Prisma } from "@prisma/client";
import { env } from "@src/config/index.js";
import { AppError, comparePassword, compareSessionSecret, createSession, databaseStringToUint8array, SessionSecurity, uint8arrayToDatabaseString } from "@src/core/index.js";
import { SessionCreate, SessionDeleteResponse } from "@src/models/index.js";
import { userRepository, sessionRepository, auditLogRepository, sessionInclude } from "@src/repository/index.js";
import { StatusCodes } from "http-status-codes";

function toSessionLog(result: Prisma.SessionGetPayload<{ include: typeof sessionInclude }>): Prisma.SessionAuditLogCreateNestedOneWithoutLogInput {
    return  {
        create: {
            user: { connect: { id: result.userId } },
            userIdSnapshot: result.userId,
            userNameSnapshot: result.user.username
        }
    };
}

function isInactive(lastVerifiedAt: Date) {
    const now = new Date();
    const timeSinceLastVerifiedMs = now.getTime() - lastVerifiedAt.getTime();
    return timeSinceLastVerifiedMs >= env.SESSION_INACTIVITY_TIMEOUT_SECONDS * 1000;
}

function shouldUpdateLastVerified(lastVerifiedAt: Date) {
    const now = new Date();
    const timeSinceLastVerifiedMs = now.getTime() - lastVerifiedAt.getTime();
    return timeSinceLastVerifiedMs >= env.SESSION_ACTIVITYCHECK_INTERVAL_SECONDS * 1000;
}

export const sessionService = {
    async create(data: SessionCreate): Promise<SessionSecurity> {
        const user = await userRepository.findByUsername(data.username);
        if (!user) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Invalid username and password.");
        }

        const isCorrectPassword = await comparePassword(
            data.password,
            user.passwordHash
        );
        if (!isCorrectPassword) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Invalid username and password.");
        }

        const sessionSecurity = await createSession();

        const result = await sessionRepository.create({
            id: sessionSecurity.id,
            secretHash: uint8arrayToDatabaseString(sessionSecurity.secretHash),
            user: { connect: { id: user.id } }
        });

        await auditLogRepository.create({
            action: LogAction.CREATE,
            actor: { connect: { id: result.user.id } },
            sessionLog: toSessionLog(result)
        });

        return sessionSecurity;
    },

    async validateSession(id: string, secret: string) {
        let result = await this.findById(id);
        if (result === null) return null;

        const isValidSecret = await compareSessionSecret(secret, databaseStringToUint8array(result.secretHash));
        if (!isValidSecret) return null;

        if (shouldUpdateLastVerified(result.lastVerifiedAt)) {
            result = await sessionRepository.update(id, { lastVerifiedAt: new Date() });
        }

        return result;
    },

    async findById(id: string) {
        const result = await sessionRepository.findById(id);
        if (result === null) return null;

        if (isInactive(result.lastVerifiedAt)) {
            await sessionRepository.delete(id);
            return null;
        }

        return result;
    },

    async deleteSelf(actorId: string, id: string): Promise<SessionDeleteResponse> {
        const result = await sessionRepository.delete(id);
        await auditLogRepository.create({
            action: LogAction.DELETE,
            actor: { connect: { id: actorId } },
            sessionLog: toSessionLog(result)
        });

        return {
            user: {
                id: result.user.id,
                username: result.user.username
            }
        };
    }
};