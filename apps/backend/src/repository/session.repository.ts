
export const sessionInclude = {
    user: true
} satisfies Prisma.SessionInclude;

export const sessionRepository = {
    async create(data: Prisma.SessionCreateInput) {
        return await prisma.session.create({
            data,
            include: sessionInclude
        });
    },

    async findById(id: string) {
        return await prisma.session.findUnique({
            where: { id },
            include: sessionInclude
        });
    },

    async update(id: string, data: Prisma.SessionUpdateInput) {
        return await prisma.session.update({
            where: { id },
            data,
            include: sessionInclude
        });
    },

    async delete(id: string) {
        return await prisma.session.delete({
            where: { id },
            include: sessionInclude
        });
    },

    async deleteAllFromUser(id: string) {
        return await prisma.session.deleteMany({
            where: { user: { id } }
        });
    }
};