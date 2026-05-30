import {courseModel} from "../models/coursemodel.js";
import {studentModel} from "../models/studentmodel.js";

// get current student profile & population of enrolled courses (protected)
//  get api/profile/student
export const getStudentProfile = async (req, res) => {
    try {
        const student = await studentModel.findById(req.user.id).populate("courses")
        .select("-password")
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  enroll current student in a  specific course (protected)
//  post api/profile/student/enroll
export const enrollCourse = async (req, res) => {
    try {
        const studentId = req.user.id;
        const courseId = req.params.id;


//   double check if course exists
    const course = await courseModel.findById(courseId);
    if (!course) {return res.status(404).json({ message: "Course not found" });
    } 
    // fetch student profile

    const student = await studentModel.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // make sure they arent't trying to enroll in a course they are already enrolled in
    const isAlreadyEnrolled = student.courses.some(id => id.toString() === courseId);
    if (isAlreadyEnrolled) {
        return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // push the course id  reference into the array and save to mongodb
    student.courses.push(courseId);
    await student.save();

    res.status(200).json({ message: "Course enrolled successfully" });
    res.status(200).json({ message: "Course enrolled successfully", student });
} catch (error) {
    res.status(500).json({ message: error.message });
}

} 
