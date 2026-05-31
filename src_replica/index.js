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
const allowedOrigins = ["http://localhost:3000", process.env.FRONTEND_URL].filter(Boolean);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'), false);
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

// Global Error Handler (Prevents crashes from uncaught errors like CORS)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});

connectDB(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;