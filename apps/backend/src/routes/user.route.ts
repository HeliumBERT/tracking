import { Router } from "express";
import { userController } from "@src/controllers/index.js";
import { jsonParser, uuidRouteParam } from "@src/core/index.js";
import { userCreateParse, userPasswordUpdateSelfParse, userUpdateOtherParse, userUpdateSelfParse } from "@src/parsers/index.js";
import { checkPrivilegeMiddleware, requireAuth } from "@src/middlewares/index.js";


export const userRouter = Router();

userRouter.use(requireAuth);
userRouter.use(...jsonParser);

userRouter.get("/:id",
    uuidRouteParam("id"),
    userController.findById
);
userRouter.post("/",
    checkPrivilegeMiddleware('ADMIN'),
    userCreateParse,
    userController.create
);

userRouter.get("/",
    checkPrivilegeMiddleware('BASIC'),
    userController.findMany
);

userRouter.patch("/current/password",
    checkPrivilegeMiddleware('BASIC'),
    userPasswordUpdateSelfParse,
    userController.passwordUpdateSelf
);
userRouter.patch("/current",
    checkPrivilegeMiddleware('BASIC'),
    userUpdateSelfParse,
    userController.updateSelf
);
userRouter.delete("/current",
    checkPrivilegeMiddleware('BASIC'),
    userController.softDeleteSelf
);
userRouter.patch("/:id",
    checkPrivilegeMiddleware('ADMIN'),
    uuidRouteParam("id"),
    userUpdateOtherParse,
    userController.updateOther
);

userRouter.delete("/:id",
    checkPrivilegeMiddleware('ADMIN'),
    uuidRouteParam("id"),
    userController.softDeleteOther
);