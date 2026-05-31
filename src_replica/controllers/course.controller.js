import {courseModel} from "../models/coursemodel.js";


// get all available courses
// get api/courses 
export const getCourses = async (req, res) => {
    try {
        const courses = await courseModel.find();
        res.status(200).json(courses);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
