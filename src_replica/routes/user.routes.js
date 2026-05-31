import { Router} from "express";
import { registerStudent,
    loginStudent,
    forgotPassword,
    resetPassword,
    logoutStudent} from "../controllers/user.controller.js";
import { checkToken } from "../middleware/authmiddleware.js"
const mainRouter = Router();

mainRouter.post("/register", registerStudent)
mainRouter.post("/login", loginStudent)
mainRouter.post("/forgot-password", forgotPassword)
mainRouter.put("/reset-password/:token", resetPassword)
mainRouter.post("/logout", logoutStudent)

export default mainRouter;
