export interface PageArgs<T> {
    pageSize?: number;
    cursor?: T;
}

export function getPagination<T>(pageArgs: PageArgs<T>) {
    return {
        take: pageArgs.pageSize ?? 10,
        skip: pageArgs.cursor ? 1 : 0,
        cursor: pageArgs.cursor ? { id: pageArgs.cursor } : undefined,
    };
}

export function getNextCursor(result: { id: string }[], pageSize: number = 10) {
    return result.length >= pageSize
        ? result[result.length - 1].id
        : null;
}