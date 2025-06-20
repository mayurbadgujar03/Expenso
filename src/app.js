import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

//router imports

import userAuth from "./routes/auth.routes.js";
import dashboard from "./routes/dashboard.routes.js";
import profile from "./routes/profile.routes.js";
import history from "./routes/history.routes.js";

app.use(express.static("public"));
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

app.use("/api/v1/users", userAuth);
app.use("/api/v1/user", dashboard);
app.use("/api/v1/user", profile);
app.use("/api/v1/user", history);

export default app;
