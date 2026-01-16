const express = require('express');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require("./routes/aiAnalysisRoute");
const vitalsRoutes = require("./routes/vitalsRoute");
const chatRoutes = require("./routes/chatRoute");
const cors = require('cors');


const app = express();


const corsOptions = {
    origin: ["http://localhost:5173",                 
        "https://health-mate-three-iota.vercel.app"   
    ],
    credentials: true, // Allow cookies to be sent
};

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use('/api/users', userRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/vitals", vitalsRoutes)
app.use("/api/chat", chatRoutes);


module.exports = app;