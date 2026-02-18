import { validateSession } from "@src/middlewares/index.js";
import { sessionRouter } from "./session.route.js";
import { userRouter } from "./user.route.js";
import express from "express";
import { baseRouter } from "./base.route.js";


export function registerRoutes(app: express.Application) {
    app.use(validateSession);

    app.use("/api/users", userRouter);
    app.use("/api/session", sessionRouter);

    app.use("/", baseRouter);
}