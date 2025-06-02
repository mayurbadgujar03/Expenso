import express from "express";

const app = express();

//router imports
import userRegister from "./routes/auth.routes.js";

app.use("/api/v1/register-user", userRegister);

export default app;