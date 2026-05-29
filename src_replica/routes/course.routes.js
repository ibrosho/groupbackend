import { Router} from "express";
import { getCourses, enrollCourse} from "../controllers/course.controller.js";
import { checkToken } from "../middleware/authmiddleware.js";

const mainRouter = Router()

mainRouter.post("/enroll/:id", checkToken, enrollCourse)
mainRouter.get("/", getCourses)

export default mainRouter;