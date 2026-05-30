import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import {connectDB} from "./db/mongodb.js";
import mainRouter from "express";
import {studentmodel} from "./models/studentmodel.js";
import {coursemodel} from "./models/coursemodel.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  origin: "http://localhost:3000"
}));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Group Backend API!" });
});

app.use("/api", Auth);

connectDB(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });


app.listen(3000, () => {
  console.log(`server listening on port 5000`);
});


 


export default app
