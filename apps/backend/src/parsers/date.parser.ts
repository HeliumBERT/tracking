import { z } from "zod";

export function dateToString(date: Date): string {
    return date.toISOString();
}

export const zodDate = z.iso.datetime({ offset: true }).transform((val) => new Date(val));