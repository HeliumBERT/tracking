import { BackendDTOs } from "@src/shared/index.js";

export type SessionCreate = BackendDTOs["SessionCreateDTO"]

type FindResponse = BackendDTOs["SessionFindResponseDTO"]
export interface SessionFindResponse extends Omit<FindResponse, "expiresOn"> {
    expiresOn: Date;
}

export type SessionDeleteResponse = BackendDTOs["SessionDeleteResponseDTO"];