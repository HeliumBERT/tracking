import { z } from "zod";

export function dateToString(date: Date): string {
    return date.toISOString();
}

export const zodDate: z.ZodType<Date, z.ZodTypeDef, string> = z.string().datetime({ offset: true }).pipe(z.coerce.date());