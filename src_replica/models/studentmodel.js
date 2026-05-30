import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,


    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
],
},
{ timestamps: true }
);


studentSchema.pre("save", async function(){
    if(!this.isModified("password"))return ;
     const salt = await bcryptjs.genSalt(10)
     this.password = await bcryptjs.hash(this.password, salt)
});

export const studentModel = mongoose.model("Student", studentSchema);