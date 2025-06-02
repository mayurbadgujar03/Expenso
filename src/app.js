import express from "express";
import cookieParser from "cookie-parser";

const app = express();

//router imports
import userRegister from "./routes/auth.routes.js";

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/users", userRegister);

export default app;