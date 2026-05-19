import { components, paths } from "@repo/backend-contract";

export type UserCreate = components["schemas"]["UserCreateDTO"];

export type UserUpdateOther = components["schemas"]["UserUpdateOtherDTO"];
export type UserUpdateSelf = components["schemas"]["UserUpdateSelfDTO"];
export type UserPasswordUpdateSelf = components["schemas"]["UserPasswordUpdateSelfDTO"];

type UResponse = components["schemas"]["UserResponseDTO"];
export interface UserResponse extends Omit<UResponse, "createdAt" | "updatedAt" | "deletedAt"> {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

type ManyResponse = components["schemas"]["UserManyResponseDTO"];
export interface UserManyResponse extends Omit<ManyResponse, "list"> {
    list: (Omit<ManyResponse["list"][0], "createdAt" | "updatedAt" | "deletedAt"> & {
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[];
}

type DeleteResponse = components["schemas"]["UserDeleteResponseDTO"];
export interface UserDeleteResponse extends Omit<DeleteResponse, "deletedAt"> {
    deletedAt: Date;
}

export type UserManyQueryRaw = NonNullable<paths["/api/users"]["get"]["parameters"]["query"]>;
export type UserManyQuery = UserManyQueryRaw;