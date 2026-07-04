const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const addressRoutes = require("./routes/addressRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(helmet())
app.use(morgan("dev"))

app.use("/api/auth", authRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/user", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/categories", categoryRoutes)

app.use(errorHandler)

module.exports = app;
