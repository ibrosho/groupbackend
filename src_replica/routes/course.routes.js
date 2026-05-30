import { Router} from "express";
import { getCourses, createCourse } from "../controllers/course.controller.js";

const mainRouter = Router()

mainRouter.get("/", getCourses)
mainRouter.post("/", createCourse)

export default mainRouter;