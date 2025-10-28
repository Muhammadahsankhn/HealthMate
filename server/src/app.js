const express = require('express');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require("./routes/fileRoute");



const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use('/api/users', userRoutes);
app.use("/api/files", fileRoutes);

module.exports = app;