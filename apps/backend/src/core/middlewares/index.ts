import { errorHandler } from "./errorHandler.js";
import express from "express";
import { sessionIdParse } from "./session.js";

export { type SessionTokenRequest, cookieSessionKey } from "./session.js";
export * from "./requestType.js";



export function loadAllGlobalMiddlewares(app: express.Application) {
    app.use(sessionIdParse);
}


export function loadErrorHandler(app: express.Application) {
    app.use(errorHandler);
}