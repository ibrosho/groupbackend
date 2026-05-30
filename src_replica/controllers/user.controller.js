import {studentmodel} from "../models/studentmodel.js , ";
import {coursemodel} from "../models/coursemodel.js";
import {generateToken} from "../utils/generateToken.js";
import {validateRegister, validateLogin} from "../utils/validation.js";
import bcrypt from "bcryptjs";
import cyrpto from "crypto";

export const gethome = (req, res) => {
  res.json({ message: "Welcome to the Group Backend API!" });
};

// register user
export const registerStudent = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const { error } = validateRegister(req.body);
        if (error) return res.status(400).send(error.details[0].message);
    
  const existingStudent = await studentmodel.findOne({ email });
    if (existingStudent) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new studentmodel({ name, email, password: hashedPassword });
    await newStudent.save();
    res.status(201).json({ message: "User created successfully" });
} catch (error) {
    res.status(500).json({ message: "Server error" });
}

};
//  login student
export const loginStudent = async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await studentmodel.findOne({ email });
        if (!student) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(student);
        res.json({ token });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({ message: "Login successful", 
            success: true
         });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
//  n forgot password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const student = await studentmodel.findOne({ email });
        if (!student) return res.status(400).json({ message: "User not found" });

        const resetToken = cyrpto.randomBytes(20).toString("hex");
        student.resetPasswordToken = resetToken;
        student.resetPasswordExpires = Date.now() + 3600000;;
        await student.save();

        const resetUrl = `http://localhost:5000/reset-password/${resetToken}`;
        console.log(`Password reset link: ${resetUrl}`);
        res.status(200).json({ message: "Password reset link sent to email" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
//  reset password
export const resetPassword = async (req, res) => {
    try {
        const hashedPassword = crypto.createHash("sha256").update(req.param.token).digest("hex");
        const student = await studentmodel.findOne({
            resetPasswordToken: hashedPassword,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!student) return res.status(400).json({ message: "Invalid or expired token" });

        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(req.body.password, salt);
        student.resetPasswordToken = undefined;
        student.resetPasswordExpires = undefined;
        await student.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }

    // logout student
    export const logoutStudent = async (req, res) => {
        try {
        res.clearCookie("token",  "",
        {httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 0,
        expires: new Date(0)
    }
    );
    res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
};

    module.exports = {
        gethome,
        registerStudent,
        loginStudent,
        forgotPassword,
        logoutStudent,
        resetPassword,
    };
