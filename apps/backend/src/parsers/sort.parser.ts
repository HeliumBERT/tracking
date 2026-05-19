import { Prisma } from "@prisma/client";
import { components } from "@repo/backend-contract";

export function toPrismaSortOrder(sortOrder: components["parameters"]["SortOrderQuery"] | undefined): Prisma.SortOrder {
    if (sortOrder === "ASC") return "asc";
    else if (sortOrder === "DESC") return "desc";
    else return "asc";
}