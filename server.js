require("dotenv").config();
const connectDB = require("./src/config/connectDB");

const app = require("./src/app");

connectDB;

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
