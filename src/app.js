import express from "express";
import cookieParser from "cookie-parser";

const app = express();

//router imports
import userRegister from "./routes/auth.routes.js";
import loginUser from "./routes/auth.routes.js";

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

export default app;
