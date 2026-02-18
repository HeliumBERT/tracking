import { Prisma } from "@prisma/client";
import { backendSpec } from "@src/shared/index.js";

export function toPrismaSortOrder(sortOrder: backendSpec.components["parameters"]["SortOrderQuery"] | undefined): Prisma.SortOrder {
    if (sortOrder === "ASC") return "asc";
    else if (sortOrder === "DESC") return "desc";
    else return "asc";
}