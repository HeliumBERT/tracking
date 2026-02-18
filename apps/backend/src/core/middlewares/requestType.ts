import bodyParser from "body-parser";
import OpenApiValidator from "express-openapi-validator";

export const openApiValidator = OpenApiValidator.middleware({
    apiSpec: "./shared/board-backend/main.yaml",
    validateApiSpec: true,
    validateRequests: true,
    validateResponses: true
});

export const jsonParser = [
    bodyParser.json(),
    openApiValidator
];