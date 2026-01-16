import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./utils/db.js";
import cookieParser from "cookie-parser";

// import all routes
import userRoutes from "./routes/user.routes.js";

dotenv.config({
  path: "./.env",
});

const app = express();
app.use(
  cors({
    origin: process.env.BASE_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "Options"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/about-us", (req, res) => {
  res.send("This is about us page");
});

app.get("/contact-us", (req, res) => {
  res.send("This is contact us page");
});

// connection to database
db();

// user routes
app.use("/api/v1/users", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
