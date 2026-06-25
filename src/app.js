const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(express.json());
app.use(cors());
app.use(errorHandler);

module.exports = app;
