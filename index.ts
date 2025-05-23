import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
export const appRoute = express();
import authRouter from "./routes/auth";
import imageRouter from "./routes/image";

dotenv.config();
const sessionKey = process.env.SESSION_KEY || "";
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
  : ["http://localhost:3002"];

console.log("CORS Allowed Origins:", allowedOrigins);

appRoute.use(
  cors({
    origin: (origin, callback) => {
      console.log("Incoming origin:", origin);
      if (
        !origin ||
        allowedOrigins.some((allowed) => origin.startsWith(allowed))
      ) {
        callback(null, true);
      } else {
        console.warn("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    exposedHeaders: ["Content-Disposition"],
  })
);
console.log("ENV:", process.env.CLIENT_URL);
appRoute.use(express.json({ limit: "50mb" }));
appRoute.use(express.urlencoded({ limit: "50mb", extended: true }));
appRoute.use(cookieParser());
// appRoute.use(
//   session({
//     secret: sessionKey,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 86400000,
//     },
//   })
// );
// appRoute.set("trust proxy", 1);
appRoute.get("/", (req, res) => {
  res.send("Backend is working!");
});
appRoute.use(authRouter);
appRoute.use(imageRouter);
