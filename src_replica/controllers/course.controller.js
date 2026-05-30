import {courseModel} from "../models/coursemodel.js";
import {validateCourse} from "../validator/uservalidator.js";


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

// create a new course
// post api/courses
export const createCourse = async (req, res) => {
    try {
        const { error } = validateCourse.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const newCourse = new courseModel(req.body);
        await newCourse.save();
        res.status(201).json({ message: "Course created successfully", course: newCourse });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
