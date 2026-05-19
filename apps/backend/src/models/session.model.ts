import { type Schemas } from "@repo/backend-contract";

export type SessionCreate = Schemas["SessionCreateDTO"]

type FindResponse = Schemas["SessionFindResponseDTO"]
export interface SessionFindResponse extends Omit<FindResponse, "expiresOn"> {
    expiresOn: Date;
}

export type SessionDeleteResponse = Schemas["SessionDeleteResponseDTO"];