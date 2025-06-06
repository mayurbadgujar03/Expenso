import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

//router imports

import userRegister from "./routes/auth.routes.js";
import loginUser from "./routes/auth.routes.js";
import logoutUser from "./routes/auth.routes.js";

import createItem from "./routes/dashboard.routes.js";
import dashboard from "./routes/dashboard.routes.js";
import confirm from "./routes/dashboard.routes.js";

import profile from "./routes/profile.routes.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/v1/users", userRegister);
app.use("/api/v1/users", loginUser);
app.use("/api/v1/user", logoutUser);

app.use("/api/v1/dashboard", createItem);
app.use("/api/v1/user", dashboard);
app.use("/api/v1/user", confirm);

app.use("/api/v1/user", profile);

export default app;
