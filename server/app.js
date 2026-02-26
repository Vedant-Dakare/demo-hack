require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const uploadRoutes = require("./routes/uploadRoutes");
const workerRoutes = require("./routes/workerRoutes");


connectDB().then(async () => {
  // correct any legacy documents that slipped through with wrong
  // category values. This is idempotent and safe to run each start.
  try {
    const Complaint = require("./models/Complaint");
    await Complaint.fixCategories();
    console.log("Complaint categories normalized");
  } catch (e) {
    console.error("Error normalizing categories:", e.message);
  }
}).catch((e) => {
  console.error("Database connection failed:", e.message);
});

// app.use(cors());
const app = express();
const allowedOrigins = [
  "https://demo-hack-jmte.vercel.app",
  "https://demo-hack-pwrm.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", complaintRoutes);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", adminRoutes);
app.use("/api/worker", workerRoutes);
app.use("/upload", uploadRoutes);
app.use("/api/upload", uploadRoutes);




app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.statusCode = 404;
  next(error);
});


app.use(errorHandler);








const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
