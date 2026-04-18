import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import "express-async-errors";

import { env } from './config/index.js';
import { registerRoutes } from './routes/index.js';
import { loadAllGlobalMiddlewares, loadErrorHandler } from './core/index.js';


export const expressApp = express();

expressApp.use(cors({
    origin: true,
    credentials: true
}));
expressApp.use(cookieParser(env.COOKIE_SECRET));

loadAllGlobalMiddlewares(expressApp);
registerRoutes(expressApp);
loadErrorHandler(expressApp);