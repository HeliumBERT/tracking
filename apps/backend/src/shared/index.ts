import * as backendSpec from "./board-backend/index.js";
import { paths as backendPaths } from "./board-backend/index.js";

type BackendDTOs = backendSpec.components["schemas"]
const backendSchemas = backendSpec.schemas;

export {
    backendSpec, backendSchemas, type BackendDTOs, type backendPaths,
};