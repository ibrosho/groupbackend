import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import {connectDB} from "./db/mongodb.js";
import userHandlers from "./routes/user.routes.js";
import studentHandlers from "./routes/student.routes.js";
import courseHandlers from "./routes/course.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = ["http://localhost:3000"]; // Add your frontend URLs here

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE"],
})); 

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Group Backend API!" });
});

app.use("/api/users", userHandlers);
app.use("/api/students", studentHandlers);
app.use("/api/courses", courseHandlers);

if (!process.env.MONGODB_URI) {
  console.error("FATAL ERROR: MONGODB_URI is not defined in .env file");
  process.exit(1);
}

connectDB(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    console.error("MongoDB Connection Error Details:", err.message);
  });

export default app
