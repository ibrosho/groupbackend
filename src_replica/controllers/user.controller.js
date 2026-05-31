import {studentModel} from "../models/studentmodel.js";
import {courseModel} from "../models/coursemodel.js";
import {generateTokens} from "../utilis/generatetoken.js";
import {validateRegister, validateLogin, validateForgotPassword, validateResetPassword} from "../validator/uservalidator.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const gethome = (req, res) => {
  res.json({ message: "Welcome to the Group Backend API!" });
};

// register user
export const registerStudent = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const { error } = validateRegister.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
    
  const existingStudent = await studentModel.findOne({ email });
    if (existingStudent) return res.status(400).json({ message: "User already exists" });

    // Removed manual hashing here because studentModel.pre("save") handles it automatically
    const newStudent = new studentModel({ name, email, password });
    await newStudent.save();
    res.status(201).json({ message: "User created successfully" });
} catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
}

};
//  login student
export const loginStudent = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error } = validateLogin.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const student = await studentModel.findOne({ email });
        if (!student) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = await generateTokens(student._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({ 
            message: "Login successful", 
            success: true,
            token
         });
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};
//  n forgot password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const { error } = validateForgotPassword.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const student = await studentModel.findOne({ email });
        if (!student) return res.status(400).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(20).toString("hex");
        // Hash the token before saving so it matches the logic in resetPassword
        student.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        student.resetPasswordExpires = Date.now() + 3600000;
        await student.save();

        const resetUrl = `${req.protocol}://${req.get('host')}/api/users/reset-password/${resetToken}`;
        console.log(`Password reset link: ${resetUrl}`);
        res.status(200).json({ message: "Password reset link sent to email" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};
//  reset password
export const resetPassword = async (req, res) => {
    try {
        const { error } = validateResetPassword.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const hashedPassword = crypto.createHash("sha256").update(req.params.token).digest("hex");
        const student = await studentModel.findOne({
            resetPasswordToken: hashedPassword,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!student) return res.status(400).json({ message: "Invalid or expired token" });

        student.password = req.body.password; // Model pre-save hook handles hashing
        student.resetPasswordToken = undefined;
        student.resetPasswordExpires = undefined;
        await student.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};

// logout student
export const logoutStudent = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 0,
            expires: new Date(0)
        });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};
