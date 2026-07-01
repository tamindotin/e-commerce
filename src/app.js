const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const addressRoutes = require("./routes/addressRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", addressRoutes);

app.use(errorHandler)

module.exports = app;
