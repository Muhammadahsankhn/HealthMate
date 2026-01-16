const express = require('express');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require("./routes/aiAnalysisRoute");
const vitalsRoutes = require("./routes/vitalsRoute");
const chatRoutes = require("./routes/chatRoute");
const cors = require('cors');


const corsOptions = {
    origin: ["http://localhost:5173",                 
        "https://health-mate-three-iota.vercel.app"   
    ],
    credentials: true, // Allow cookies to be sent
};
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use('/api/users', userRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/vitals", vitalsRoutes)
app.use("/api/chat", chatRoutes);


module.exports = app;