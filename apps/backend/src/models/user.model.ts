import { BackendDTOs, backendPaths } from "@src/shared/index.js";

export type UserCreate = BackendDTOs["UserCreateDTO"];

export type UserUpdateOther = BackendDTOs["UserUpdateOtherDTO"];
export type UserUpdateSelf = BackendDTOs["UserUpdateSelfDTO"];
export type UserPasswordUpdateSelf = BackendDTOs["UserPasswordUpdateSelfDTO"];

type UResponse = BackendDTOs["UserResponseDTO"];
export interface UserResponse extends Omit<UResponse, "createdAt" | "updatedAt" | "deletedAt"> {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

type ManyResponse = BackendDTOs["UserManyResponseDTO"];
export interface UserManyResponse extends Omit<ManyResponse, "list"> {
    list: (Omit<ManyResponse["list"][0], "createdAt" | "updatedAt" | "deletedAt"> & {
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[];
}

type DeleteResponse = BackendDTOs["UserDeleteResponseDTO"];
export interface UserDeleteResponse extends Omit<DeleteResponse, "deletedAt"> {
    deletedAt: Date;
}

export type UserManyQueryRaw = NonNullable<backendPaths["/api/users"]["get"]["parameters"]["query"]>;
export type UserManyQuery = UserManyQueryRaw;