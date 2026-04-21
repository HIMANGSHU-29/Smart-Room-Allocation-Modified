import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import admin from "firebase-admin";
import connectDB from "./config/db.js";

import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import * as Sentry from "@sentry/node";
import logger from "./utils/logger.js";

import studentRoutes from "./routes/studentRoutes.js";
import allocationRoutes from "./routes/allocationRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import examAllocationRoutes from "./routes/examAllocationRoutes.js";
import errorRoutes from "./routes/errorRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";

dotenv.config();

// Sentry initialization
if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

connectDB();

// Initialize Firebase Admin
admin.initializeApp({
  projectId: "allocateu-dab0d"
});

const app = express();

// Sentry Request Handler
if (process.env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

// Security headers
app.use(helmet());

// CORS config
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));

// HTTP logging
app.use(morgan(
  ':method :url :status :response-time ms',
  { stream: { write: msg => logger.info(msg.trim()) } }
));

app.use("/api/students", studentRoutes);
app.use("/api/allocation", allocationRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/exam-allocation", examAllocationRoutes);
app.use("/api/errors", errorRoutes);
app.use("/api/teachers", teacherRoutes);

app.get("/", (req, res) => {
  res.send("API Running securely...");
});

// Remove sensitive data from errors
app.use((err, req, res, next) => {
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong'
    : err.message;
  
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }
  
  logger.error(err.stack || err.message);
  
  res.status(500).json({ error: message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running securely on all interfaces at port ${PORT}`);
});