import { Router} from "express";
import { getCourses } from "../controllers/course.controller.js";

const mainRouter = Router()



mainRouter.get("/", getCourses)

export default mainRouter;

