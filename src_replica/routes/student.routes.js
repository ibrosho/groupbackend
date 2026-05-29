import { Router} from "express";
import { getStudentProfile } from "../controllers/student.controller.js";
import { checkToken } from "../middleware/authmiddleware.js";

const mainRouter = Router()

mainRouter.get("/profile", checkToken, getStudentProfile)

export default mainRouter;