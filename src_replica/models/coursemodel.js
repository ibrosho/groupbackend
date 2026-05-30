import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        required: true,

    },
    instructor:{
        type: String,
        required: true,

    },
    duration:{
        type: String,
        required: true,
} ,
},
{ timestamps: true });

export const courseModel = mongoose.model("Course", courseSchema);