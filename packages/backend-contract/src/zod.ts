import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const date = z.string();
const DocumentClassification = z.enum(["OFFICIAL", "CONFIDENTIAL"]);
const DocumentReceiveMode = z.enum(["EMAIL", "HAND_CARRY", "COURIER", "OTHER"]);
const DocumentCreateDTO = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    documentDate: date.datetime({ offset: true }),
    documentNumber: z.string(),
    classification: DocumentClassification,
    receiveMode: DocumentReceiveMode,
    officeName: z.string(),
    notes: z.string().optional(),
  })
  .passthrough();
const id = z.string();
const ActorDTO = z
  .object({ id: id.uuid(), username: z.string() })
  .passthrough();
const DocumentFileLabel = z.enum([
  "LETTER",
  "FORM",
  "EMAIL",
  "HANDWRITTEN",
  "ADVERTISEMENT",
  "SCIENTIFIC_REPORT",
  "SCIENTIFIC_PUBLICATION",
  "SPECIFICATION",
  "FILE_FOLDER",
  "NEWS_ARTICLE",
  "BUDGET",
  "INVOICE",
  "PRESENTATION",
  "QUESTIONNAIRE",
  "RESUME",
  "MEMO",
]);
const DocumentFileResponseDTO = z
  .object({
    id: id.uuid(),
    documentId: id.uuid(),
    title: z.string(),
    content: z.string(),
    labels: z.array(DocumentFileLabel),
    mimetype: z.string(),
    fileSizeBytes: z.number().int(),
    createdAt: date.datetime({ offset: true }),
    updatedAt: date.datetime({ offset: true }),
    author: ActorDTO,
    updator: ActorDTO,
    softDeletedAt: z.union([date, z.null()]).optional(),
  })
  .passthrough();
const DocumentResponseDTO = z
  .object({
    id: id.uuid(),
    title: z.string(),
    description: z.string().optional(),
    documentDate: date.datetime({ offset: true }),
    documentNumber: z.string().optional(),
    classification: DocumentClassification,
    receiveMode: DocumentReceiveMode,
    officeName: z.string(),
    notes: z.string().optional(),
    createdAt: date.datetime({ offset: true }),
    updatedAt: date.datetime({ offset: true }),
    author: ActorDTO,
    updator: ActorDTO,
    files: z.array(DocumentFileResponseDTO),
    softDeletedAt: z.union([date, z.null()]).optional(),
  })
  .passthrough();
const anything = z.union([
  z.object({}).partial().passthrough(),
  z.array(z.any()),
  z.boolean(),
  z.number(),
  z.number(),
  z.string(),
  z.null(),
]);
const ErrorDTO = z
  .object({ message: z.string(), moreInfo: anything.optional() })
  .passthrough();
const DocumentManyResponseItemDTO = z
  .object({
    id: id.uuid(),
    title: z.string(),
    description: z.string().optional(),
    documentDate: date.datetime({ offset: true }),
    documentNumber: z.string().optional(),
    classification: DocumentClassification,
    receiveMode: DocumentReceiveMode,
    officeName: z.string(),
    notes: z.string().optional(),
    createdAt: date.datetime({ offset: true }),
    updatedAt: date.datetime({ offset: true }),
    author: ActorDTO,
    updator: ActorDTO,
    softDeletedAt: z.union([date, z.null()]).optional(),
  })
  .passthrough();
const DocumentManyResponseDTO = z
  .object({
    list: z.array(DocumentManyResponseItemDTO),
    nextCursor: z.union([id, z.null()]),
  })
  .passthrough();
const DocumentUpdateDTO = z
  .object({
    title: z.string(),
    description: z.string(),
    documentDate: date.datetime({ offset: true }),
    documentNumber: z.string(),
    classification: DocumentClassification,
    receiveMode: DocumentReceiveMode,
    officeName: z.string(),
    notes: z.string(),
  })
  .partial()
  .passthrough();
const DocumentSoftDeleteActionResponseDTO = z
  .object({ id: id.uuid(), title: z.string() })
  .passthrough();
const DocumentHardDeleteResponseDTO = z
  .object({
    id: id.uuid(),
    title: z.string(),
    failedDeleteFiles: z.array(
      z.object({ id: id.uuid(), error: z.string() }).passthrough()
    ),
  })
  .passthrough();
const LogAction = z.enum([
  "CREATE",
  "READ",
  "UPDATE",
  "DELETE",
  "SOFT_DELETE",
  "RESTORE",
]);
const AuditLogResponseDTO = z
  .object({
    list: z.array(
      z
        .object({
          id: id.uuid(),
          action: LogAction,
          actor: z
            .object({ id: id.uuid(), username: z.string() })
            .passthrough(),
          createdAt: date.datetime({ offset: true }),
          documentLog: z
            .object({
              document: z
                .object({ id: id.uuid(), title: z.string() })
                .passthrough()
                .optional(),
              documentIdSnapshot: id.uuid(),
              documentTitleSnapshot: z.string(),
            })
            .passthrough()
            .optional(),
          documentFileLog: z
            .object({
              document: z
                .object({ id: id.uuid(), title: z.string() })
                .passthrough()
                .optional(),
              documentIdSnapshot: id.uuid(),
              documentTitleSnapshot: z.string(),
              documentFile: z
                .object({ id: id.uuid(), title: z.string() })
                .passthrough()
                .optional(),
              documentFileIdSnapshot: id.uuid(),
              documentFileTitleSnapshot: z.string(),
            })
            .passthrough()
            .optional(),
          userLog: z
            .object({
              user: z
                .object({ id: id.uuid(), username: z.string() })
                .passthrough()
                .optional(),
              userIdSnapshot: id.uuid(),
              userNameSnapshot: z.string(),
            })
            .passthrough()
            .optional(),
          sessionLog: z
            .object({
              user: z
                .object({ id: id.uuid(), username: z.string() })
                .passthrough()
                .optional(),
              userIdSnapshot: id.uuid(),
              userNameSnapshot: z.string(),
            })
            .passthrough()
            .optional(),
        })
        .passthrough()
    ),
    nextCursor: z.union([id, z.null()]),
  })
  .passthrough();
const DocumentFileCreateDTO = z
  .object({
    title: z.string(),
    content: z.string(),
    labels: z.array(DocumentFileLabel).optional(),
  })
  .passthrough();
const DocumentFileCreateResponseDTO = z
  .object({
    id: id.uuid(),
    createdAt: date.datetime({ offset: true }),
    uploadFileTo: z.string(),
  })
  .passthrough();
const DocumentFileUpdateDTO = z
  .object({
    title: z.string(),
    content: z.string(),
    labels: z.array(DocumentFileLabel),
  })
  .partial()
  .passthrough();
const DocumentFileStatusChangeResponseDTO = z
  .object({
    id: id.uuid(),
    documentId: id.uuid(),
    title: z.string().optional(),
  })
  .passthrough();
const UserPrivilege = z.enum(["ADMIN", "BASIC"]);
const UserCreateDTO = z
  .object({
    username: z.string(),
    email: z.string(),
    password: z.string(),
    privilege: UserPrivilege,
  })
  .passthrough();
const UserResponseDTO = z
  .object({
    id: id.uuid(),
    username: z.string(),
    email: z.string(),
    privilege: UserPrivilege,
    createdAt: date.datetime({ offset: true }),
    updatedAt: date.datetime({ offset: true }),
    deletedAt: z.union([date, z.null()]),
  })
  .passthrough();
const UserManyResponseDTO = z
  .object({
    list: z.array(
      z
        .object({
          id: id.uuid(),
          username: z.string(),
          email: z.string(),
          privilege: UserPrivilege,
          createdAt: date.datetime({ offset: true }),
          updatedAt: date.datetime({ offset: true }),
          deletedAt: z.union([date, z.null()]),
        })
        .passthrough()
    ),
    nextCursor: z.union([id, z.null()]),
  })
  .passthrough();
const UserUpdateOtherDTO = z
  .object({ username: z.string(), email: z.string(), privilege: UserPrivilege })
  .partial()
  .passthrough();
const UserDeleteResponseDTO = z
  .object({
    id: id.uuid(),
    username: z.string(),
    deletedAt: date.datetime({ offset: true }),
  })
  .passthrough();
const UserUpdateSelfDTO = z
  .object({ username: z.string(), email: z.string() })
  .partial()
  .passthrough();
const UserPasswordUpdateSelfDTO = z
  .object({ currentPassword: z.string(), newPassword: z.string() })
  .passthrough();
const SessionCreateDTO = z
  .object({ username: z.string(), password: z.string() })
  .passthrough();
const SessionFindResponseDTO = z
  .object({
    user: z
      .object({
        id: id.uuid(),
        username: z.string(),
        email: z.string(),
        privilege: UserPrivilege,
      })
      .passthrough(),
  })
  .passthrough();
const SessionDeleteResponseDTO = z
  .object({
    user: z.object({ id: id.uuid(), username: z.string() }).passthrough(),
  })
  .passthrough();
const ClassifyRequestDTO = z.object({ text: z.string() }).passthrough();
const ClassifyLabel = z.enum([
  "LETTER",
  "FORM",
  "EMAIL",
  "HANDWRITTEN",
  "ADVERTISEMENT",
  "SCIENTIFIC_REPORT",
  "SCIENTIFIC_PUBLICATION",
  "SPECIFICATION",
  "FILE_FOLDER",
  "NEWS_ARTICLE",
  "BUDGET",
  "INVOICE",
  "PRESENTATION",
  "QUESTIONNAIRE",
  "RESUME",
  "MEMO",
]);
const ClassifyLabelProbabilityDTO = z
  .object({ label: ClassifyLabel, probability: z.number() })
  .passthrough();
const ClassifyResponseDTO = z
  .object({
    labelProbabilities: z.array(ClassifyLabelProbabilityDTO),
    loss: z.number(),
    time_s: z.number(),
    suggestedLabels: z.array(ClassifyLabel),
  })
  .passthrough();
const ContentExtractResponseDTO = z
  .object({ content: z.string() })
  .passthrough();
const DocumentInferFieldsDTO = z
  .object({
    content: z.string(),
    title: z.union([z.string(), z.null()]),
    description: z.string(),
    documentNumber: z.union([z.string(), z.null()]),
    officeName: z.union([z.string(), z.null()]),
    documentDate: z.union([date, z.null()]),
    notes: z.union([z.string(), z.null()]),
    classifyResponse: ClassifyResponseDTO,
  })
  .passthrough();
const DashboardResponseDTO = z
  .object({
    documents: z
      .object({
        count: z.number(),
        softDeletedCount: z.number().optional(),
        recentActivity: z.array(DocumentManyResponseItemDTO),
        noFileDocuments: z.array(DocumentManyResponseItemDTO),
        activity: z.array(
          z
            .object({
              date: date.datetime({ offset: true }),
              createCount: z.number().int(),
            })
            .passthrough()
        ),
      })
      .passthrough(),
    file: z
      .object({
        count: z.number(),
        softDeletedCount: z.number().optional(),
        totalUsedStorageBytes: z.number(),
        labelGraph: z.array(
          z
            .object({ label: DocumentFileLabel, count: z.number() })
            .passthrough()
        ),
      })
      .passthrough(),
    auditLogs: z
      .object({
        activity: z.array(
          z
            .object({
              date: date.datetime({ offset: true }),
              createCount: z.number().int(),
              readCount: z.number().int(),
              updateCount: z.number().int(),
              deleteCount: z.number().int(),
              softDeleteCount: z.number().int(),
              restoreCount: z.number().int(),
            })
            .passthrough()
        ),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export const schemas = {
  date,
  DocumentClassification,
  DocumentReceiveMode,
  DocumentCreateDTO,
  id,
  ActorDTO,
  DocumentFileLabel,
  DocumentFileResponseDTO,
  DocumentResponseDTO,
  anything,
  ErrorDTO,
  DocumentManyResponseItemDTO,
  DocumentManyResponseDTO,
  DocumentUpdateDTO,
  DocumentSoftDeleteActionResponseDTO,
  DocumentHardDeleteResponseDTO,
  LogAction,
  AuditLogResponseDTO,
  DocumentFileCreateDTO,
  DocumentFileCreateResponseDTO,
  DocumentFileUpdateDTO,
  DocumentFileStatusChangeResponseDTO,
  UserPrivilege,
  UserCreateDTO,
  UserResponseDTO,
  UserManyResponseDTO,
  UserUpdateOtherDTO,
  UserDeleteResponseDTO,
  UserUpdateSelfDTO,
  UserPasswordUpdateSelfDTO,
  SessionCreateDTO,
  SessionFindResponseDTO,
  SessionDeleteResponseDTO,
  ClassifyRequestDTO,
  ClassifyLabel,
  ClassifyLabelProbabilityDTO,
  ClassifyResponseDTO,
  ContentExtractResponseDTO,
  DocumentInferFieldsDTO,
  DashboardResponseDTO,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/",
    alias: "Base",
    requestFormat: "json",
    response: z.object({ message: z.string() }).passthrough(),
  },
  {
    method: "get",
    path: "/api/auditLogs",
    alias: "getApiauditLogs",
    requestFormat: "json",
    parameters: [
      {
        name: "actorId",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
      {
        name: "entityId",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
      {
        name: "entityType",
        type: "Query",
        schema: z
          .enum(["DOCUMENT", "DOCUMENT_FILE", "USER", "SESSION"])
          .optional(),
      },
      {
        name: "logActions",
        type: "Query",
        schema: z.array(LogAction).optional(),
      },
      {
        name: "fromDate",
        type: "Query",
        schema: z.string().datetime({ offset: true }).optional(),
      },
      {
        name: "toDate",
        type: "Query",
        schema: z.string().datetime({ offset: true }).optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().optional(),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
      {
        name: "sortOrder",
        type: "Query",
        schema: z.enum(["ASC", "DESC"]).optional(),
      },
    ],
    response: AuditLogResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "get",
    path: "/api/dashboard",
    alias: "getApidashboard",
    requestFormat: "json",
    parameters: [
      {
        name: "fromDate",
        type: "Query",
        schema: z.string().datetime({ offset: true }).optional(),
      },
      {
        name: "toDate",
        type: "Query",
        schema: z.string().datetime({ offset: true }).optional(),
      },
    ],
    response: DashboardResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "post",
    path: "/api/documents",
    alias: "DocumentCreate",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: DocumentCreateDTO,
      },
    ],
    response: DocumentResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "get",
    path: "/api/documents",
    alias: "DocumentMany",
    requestFormat: "json",
    parameters: [
      {
        name: "searchTerm",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "fromDate",
        type: "Query",
        schema: z.string().datetime({ offset: true }).optional(),
      },
      {
        name: "toDate",
        type: "Query",
        schema: z.string().datetime({ offset: true }).optional(),
      },
      {
        name: "classification",
        type: "Query",
        schema: z.enum(["OFFICIAL", "CONFIDENTIAL"]).optional(),
      },
      {
        name: "receiveMode",
        type: "Query",
        schema: z.enum(["EMAIL", "HAND_CARRY", "COURIER", "OTHER"]).optional(),
      },
      {
        name: "fileLabels",
        type: "Query",
        schema: z.array(DocumentFileLabel).optional(),
      },
      {
        name: "authorId",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
      {
        name: "showSoftDeleted",
        type: "Query",
        schema: z.boolean().optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().optional(),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
      {
        name: "documentSortBy",
        type: "Query",
        schema: z
          .enum([
            "TITLE",
            "DOCUMENT_DATE",
            "DOCUMENT_NUMBER",
            "OFFICE_NAME",
            "CREATED_AT",
            "UPDATED_AT",
          ])
          .optional(),
      },
      {
        name: "sortOrder",
        type: "Query",
        schema: z.enum(["ASC", "DESC"]).optional(),
      },
    ],
    response: DocumentManyResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "get",
    path: "/api/documents/:id",
    alias: "DocumentGet",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: DocumentResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "patch",
    path: "/api/documents/:id",
    alias: "DocumentUpdate",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: DocumentUpdateDTO,
      },
    ],
    response: DocumentResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "delete",
    path: "/api/documents/:id",
    alias: "DocumentSoftDelete",
    requestFormat: "json",
    response: DocumentSoftDeleteActionResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "get",
    path: "/api/documents/:id/auditLogs",
    alias: "DocumentAuditLogGet",
    requestFormat: "json",
    parameters: [
      {
        name: "includeFileLogs",
        type: "Query",
        schema: z.boolean().optional(),
      },
      {
        name: "logActions",
        type: "Query",
        schema: z.array(LogAction).optional(),
      },
      {
        name: "fromDate",
        type: "Query",
        schema: z.string().datetime({ offset: true }).optional(),
      },
      {
        name: "toDate",
        type: "Query",
        schema: z.string().datetime({ offset: true }).optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().optional(),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
      {
        name: "sortOrder",
        type: "Query",
        schema: z.enum(["ASC", "DESC"]).optional(),
      },
    ],
    response: AuditLogResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "post",
    path: "/api/documents/:id/files",
    alias: "DocumentFileCreate",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: DocumentFileCreateDTO,
      },
    ],
    response: DocumentFileCreateResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "get",
    path: "/api/documents/:id/files/:fileId",
    alias: "DocumentFileGet",
    requestFormat: "json",
    response: DocumentFileResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "patch",
    path: "/api/documents/:id/files/:fileId",
    alias: "DocumentFileUpdate",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: DocumentFileUpdateDTO,
      },
    ],
    response: DocumentFileResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "delete",
    path: "/api/documents/:id/files/:fileId",
    alias: "DocumentFileSoftDelete",
    requestFormat: "json",
    response: DocumentFileStatusChangeResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "get",
    path: "/api/documents/:id/files/:fileId/auditLogs",
    alias: "DocumentFileAuditLogGet",
    requestFormat: "json",
    parameters: [
      {
        name: "logActions",
        type: "Query",
        schema: z.array(LogAction).optional(),
      },
      {
        name: "fromDate",
        type: "Query",
        schema: z.string().datetime({ offset: true }).optional(),
      },
      {
        name: "toDate",
        type: "Query",
        schema: z.string().datetime({ offset: true }).optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().optional(),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
      {
        name: "sortOrder",
        type: "Query",
        schema: z.enum(["ASC", "DESC"]).optional(),
      },
    ],
    response: AuditLogResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "post",
    path: "/api/documents/:id/files/:fileId/blob",
    alias: "DocumentFileBlobPost",
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ file: z.instanceof(File) }).passthrough(),
      },
    ],
    response: DocumentFileResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "get",
    path: "/api/documents/:id/files/:fileId/blob",
    alias: "DocumentFileContentGet",
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "delete",
    path: "/api/documents/:id/files/:fileId/hard",
    alias: "DocumentFileHardDelete",
    requestFormat: "json",
    response: DocumentFileStatusChangeResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "post",
    path: "/api/documents/:id/files/:fileId/restore",
    alias: "DocumentFileRestore",
    requestFormat: "json",
    response: DocumentFileStatusChangeResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "delete",
    path: "/api/documents/:id/hard",
    alias: "DocumentHardDelete",
    requestFormat: "json",
    response: DocumentHardDeleteResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "post",
    path: "/api/documents/:id/restore",
    alias: "DocumentRestore",
    requestFormat: "json",
    response: DocumentSoftDeleteActionResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "post",
    path: "/api/inference/classify",
    alias: "Classify",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ text: z.string() }).passthrough(),
      },
      {
        name: "model",
        type: "Query",
        schema: z.enum(["albert", "heliumbert"]).optional(),
      },
    ],
    response: ClassifyResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "post",
    path: "/api/inference/contentExtract",
    alias: "ContentExtract",
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ file: z.instanceof(File) }).passthrough(),
      },
    ],
    response: z.object({ content: z.string() }).passthrough(),
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "post",
    path: "/api/inference/documentInfer",
    alias: "DocumentInfer",
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ file: z.instanceof(File) }).passthrough(),
      },
    ],
    response: DocumentInferFieldsDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "post",
    path: "/api/session",
    alias: "SessionCreate",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: SessionCreateDTO,
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "get",
    path: "/api/session/auditLogs",
    alias: "SessionAuditLogGet",
    requestFormat: "json",
    parameters: [
      {
        name: "userId",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
      {
        name: "logActions",
        type: "Query",
        schema: z.array(LogAction).optional(),
      },
      {
        name: "fromDate",
        type: "Query",
        schema: z.string().datetime({ offset: true }).optional(),
      },
      {
        name: "toDate",
        type: "Query",
        schema: z.string().datetime({ offset: true }).optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().optional(),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
      {
        name: "sortOrder",
        type: "Query",
        schema: z.enum(["ASC", "DESC"]).optional(),
      },
    ],
    response: AuditLogResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "get",
    path: "/api/session/current",
    alias: "SessionGetSelf",
    requestFormat: "json",
    response: SessionFindResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "delete",
    path: "/api/session/current",
    alias: "SessionDeleteSelf",
    requestFormat: "json",
    response: SessionDeleteResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "post",
    path: "/api/users",
    alias: "UserCreate",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UserCreateDTO,
      },
    ],
    response: UserResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 409,
        description: `Client sent a request with conflicting information.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "get",
    path: "/api/users",
    alias: "UserMany",
    requestFormat: "json",
    parameters: [
      {
        name: "searchTerm",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().optional(),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
    ],
    response: UserManyResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "get",
    path: "/api/users/:id",
    alias: "UserGet",
    requestFormat: "json",
    response: UserResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "patch",
    path: "/api/users/:id",
    alias: "UserUpdate",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UserUpdateOtherDTO,
      },
    ],
    response: UserResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "delete",
    path: "/api/users/:id",
    alias: "UserSoftDelete",
    requestFormat: "json",
    response: UserDeleteResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "get",
    path: "/api/users/:id/auditLogs",
    alias: "UserAuditLogGet",
    requestFormat: "json",
    parameters: [
      {
        name: "logActions",
        type: "Query",
        schema: z.array(LogAction).optional(),
      },
      {
        name: "fromDate",
        type: "Query",
        schema: z.string().datetime({ offset: true }).optional(),
      },
      {
        name: "toDate",
        type: "Query",
        schema: z.string().datetime({ offset: true }).optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().optional(),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
      {
        name: "sortOrder",
        type: "Query",
        schema: z.enum(["ASC", "DESC"]).optional(),
      },
    ],
    response: AuditLogResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "patch",
    path: "/api/users/current",
    alias: "UserUpdateSelf",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UserUpdateSelfDTO,
      },
    ],
    response: UserResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "delete",
    path: "/api/users/current",
    alias: "UserDeleteSelf",
    requestFormat: "json",
    response: UserDeleteResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
  {
    method: "patch",
    path: "/api/users/current/password",
    alias: "UserPasswordUpdateSelf",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UserPasswordUpdateSelfDTO,
      },
    ],
    response: UserResponseDTO,
    errors: [
      {
        status: 400,
        description: `Client sent a malformed request.`,
        schema: ErrorDTO,
      },
      {
        status: 401,
        description: `Client is not authorized for this request.`,
        schema: ErrorDTO,
      },
      {
        status: 403,
        description: `Client does not have sufficient permissions.`,
        schema: ErrorDTO,
      },
      {
        status: 404,
        description: `Client tried to find a resource that doesn&#x27;t exist.`,
        schema: ErrorDTO,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: anything,
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
