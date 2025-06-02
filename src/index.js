import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./db/index.js";

dotenv.config();

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error", error);
  })
  .finally(() => console.log("Process of connecting db completed"));
