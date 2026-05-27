import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5100; // Define PORT here
app.use(cookieParser());

// Define allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5100", // Your React app URL for local development
  "http://localhost:3000", // Common React development server port
  process.env.FRONTEND_URL, // Your Vercel frontend URL (set this in Vercel environment variables)
];

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


export default app
