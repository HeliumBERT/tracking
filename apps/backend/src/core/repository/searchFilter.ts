import { Prisma } from "@prisma/client";

export function searchFilter(input?: string): Prisma.StringFilter | undefined {
    if (input === undefined) return undefined;

    return {
        contains: input,
        mode: "insensitive"
    };
}