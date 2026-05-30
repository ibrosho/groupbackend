import { Router} from "express";
import { getStudentProfile, enrollCourse } from "../controllers/student.controller.js";
import { checkToken } from "../middleware/authmiddleware.js";

const mainRouter = Router()

mainRouter.get("/profile", checkToken, getStudentProfile)
mainRouter.post("/enroll/:id", checkToken, enrollCourse)

export default mainRouter;