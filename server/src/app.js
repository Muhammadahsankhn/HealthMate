const express = require('express');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require("./routes/aiAnalysisRoute");
const vitalsRoutes = require("./routes/vitalsRoute");
const chatRoutes = require("./routes/chatRoute");
const cors = require('cors');

const app = express();

// 1. Define the allowed origins here
const allowedOrigins = [
  "http://localhost:5173",
  "https://health-mate-three-iota.vercel.app"
];

// 2. Use CORS exactly once with the correct logic
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    // Check if the incoming origin is in our allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/vitals", vitalsRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;