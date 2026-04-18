import { jsonParser } from "@src/core/index.js";
import { Router } from "express";

export const baseRouter = Router();
baseRouter.use(...jsonParser);

baseRouter.get("/", (req, res) => {
    return res.status(200).send({
        message: "Hello World! This is the backend of DOMAINT! Are you looking for something?"
    });
});