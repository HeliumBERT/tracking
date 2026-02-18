import { prisma } from "@src/config/index.js";
import { PrivilegeLevel, type Prisma } from "@prisma/client";
import { UserManyQuery } from "@src/models/user.model.js";
import { getPagination, PageArgs, searchFilter } from "@src/core/index.js";



export const userRepository = {
    async create(data: Prisma.UserCreateInput) {
        return await prisma.user.create({
            data
        });
    },

    async findById(id: string) {
        return await prisma.user.findUnique({
            where: { id }
        });
    },

    async findMany(query: UserManyQuery, pageArgs: PageArgs<string>) {
        const where: Prisma.UserWhereInput = {};
        if (query.searchTerm !== undefined) {
            where.OR = [
                { id: query.searchTerm },
                { username: searchFilter(query.searchTerm) },
                { email: searchFilter(query.searchTerm) },
            ];
        }

        return await prisma.user.findMany({
            ...getPagination(pageArgs),
            where,
            orderBy: { createdAt: "desc" }
        });
    },

    async findByUsername(username: string) {
        return await prisma.user.findFirst({
            where: {
                username: username,
                deletedAt: null
            }
        });
    },

    async update(id: string, data: Prisma.UserUpdateInput) {
        return await prisma.user.update({
            where: { id },
            data
        });
    },

    async softDelete(id: string) {
        return await prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    },

    async countActiveAdmin() {
        return await prisma.user.count({
            where: { privilege: PrivilegeLevel.ADMIN, deletedAt: null }
        });
    }
};