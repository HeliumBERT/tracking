import { DocumentClassification, DocumentFileLabel, DocumentReceiveMode, LogAction, Prisma, PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { hashPassword } from "../src/core/service/crypto/index.ts";

const client = new PrismaClient();

const count = 100;

function randomItem<T>(array: T[]) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomDate() {
    const fromTime = new Date().getTime();
    const toTime = new Date().getTime() + (1 * 1000 * 60 * 60 * 24 * 31 * 12);
    return new Date(fromTime + Math.random() * (toTime - fromTime));
}

const classifications: DocumentClassification[] = ["CONFIDENTIAL", "OFFICIAL"];
const receiveModes: DocumentReceiveMode[] = ["COURIER", "EMAIL", "HAND_CARRY", "OTHER"];
const fileLabels: DocumentFileLabel[] = [
    "ADVERTISEMENT", "BUDGET", "EMAIL", "FILE_FOLDER", "FORM",
    "HANDWRITTEN", "INVOICE", "LETTER", "MEMO", "NEWS_ARTICLE",
    "PRESENTATION", "QUESTIONNAIRE", "RESUME", "SCIENTIFIC_PUBLICATION",
    "SCIENTIFIC_REPORT", "SPECIFICATION"
];

const logActions: LogAction[] = ["CREATE", "DELETE", "READ", "RESTORE", "SOFT_DELETE", "UPDATE"];

async function main() {
    const users: Prisma.UserGetPayload<object>[] = [];
    for (let i = 0; i < count; i++) {
        const user = await client.user.create({
            data: {
                username: `User #${i} ${uuid()}`,
                email: `${uuid()}@gmail.com`,
                passwordHash: await hashPassword("seededUser"),
                privilege: "BASIC",
            }
        });
        users.push(user);
    }

    const documents: Prisma.DocumentGetPayload<object>[] = [];
    for (let i = 0; i < count; i++) {
        const document = await client.document.create({
            data: {
                title: `Document #${i} ${uuid()}`,
                description: uuid(),
                documentDate: randomDate(),
                documentNumber: `No. ${i}, s. 2025`,
                classification: randomItem(classifications),
                receiveMode: randomItem(receiveModes),
                officeName: `Office ${uuid()}`,
                notes: uuid(),
                author: { connect: { id: randomItem(users).id } },
                updator: { connect: { id: randomItem(users).id } },
                softDeletedAt: randomItem([null, randomDate(), randomDate()]),
            }
        });

        documents.push(document);
    }

    const documentFiles: Prisma.DocumentFileGetPayload<{ include: { document: true; blob: true } }>[] = [];
    for (let i = 0; i < count; i++) {
        const author = randomItem(users);
        const documentFile = await client.documentFile.create({
            data: {
                blob: randomItem([true, true, true, false]) ? { create: {
                    currentFilename: "trash.png",
                    storagePath: "uploads/documents/",
                    mimetype: "image/png",
                    author: { connect: { id: author.id } }
                } } : undefined,

                author: { connect: { id: author.id } },
                updator: { connect: { id: randomItem(users).id } },
                title: `Document File #${i} ${uuid()}`,
                content: [uuid(), uuid(), uuid(), uuid(), uuid()].join(" "),
                labels: [randomItem(fileLabels), randomItem(fileLabels)],
                document: { connect: { id: randomItem(documents).id } },
                softDeletedAt: randomItem([null, randomDate(), randomDate()]),
            },
            include: { document: true, blob: true }
        });

        documentFiles.push(documentFile);
    }

    for (let i = 0; i < count; i++) {
        const data: Prisma.AuditLogCreateInput = {
            action: randomItem(logActions),
            actor: { connect: { id: randomItem(users).id } }
        };

        const roll = randomItem(["document", "document", "documentFile", "user", "session"] as const);
        if (roll === "document") {
            const document = randomItem(documents);
            data.documentLog = { create: {
                document: { connect: { id: document.id } },
                documentIdSnapshot: document.id,
                documentTitleSnapshot: document.title
            } };
        } else if (roll === "documentFile") {
            const file = randomItem(documentFiles);
            data.documentFileLog = { create: {
                document: { connect: { id: file.document.id } },
                documentIdSnapshot: file.document.id,
                documentTitleSnapshot: file.document.title,

                documentFile: { connect: { id: file.id } },
                documentFileIdSnapshot: file.id,
                documentFileTitleSnapshot: file.title
            } };
        }

        await client.auditLog.create({
            data
        });
    }
}

main().then().finally(async () => { client.$disconnect(); });