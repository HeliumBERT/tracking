import expressListRoutes from "express-list-routes";
import { expressApp } from "./app.js";
import { startup } from "./startup/index.js";


expressListRoutes(expressApp);

expressApp.listen(3000, "0.0.0.0", () => {
    startup();
    console.log(`Server is running at http://0.0.0.0:3000`);
});