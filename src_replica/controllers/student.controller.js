import {coursemodel} from "../models/coursemodel.js";
import {studentmodel} from "../models/studentmodel.js";

// get current student profile & population of enrolled courses (protected)
//  get api/profile/student
export const getStudentprofile = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).populate("enrolledCourses")
        .select("-password")
        .populate("enrolledCourses");
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
        const student = req.user.id;
        const courseId = req.params.courseId;


//   double check if course exists
    const course = await Course.findById(courseId);
    if (!course) {return res.status(404).json({ message: "Course not found" });
    } 
    // fetch student profile

    const student = await Student.findById(req.user.id);


    // make sure they arent't trying to enroll in a course they are already enrolled in
    if (student.enrolledCourses.includes(courseId)) {
        return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // push the course id  reference into the array and save to mongodb
    student.enrolledCourses.push(courseId);
    await student.save();

    res.status(200).json({ message: "Course enrolled successfully" });
} catch (error) {
    res.status(500).json({ message: error.message });
}

} 

export const studentController = mongoose.model("Student", studentSchema);

