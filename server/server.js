import "dotenv/config";

import "./src/config/redis.js";
import connectDB from "./src/config/connectDB.js";
import app from "./src/app.js";

connectDB();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
