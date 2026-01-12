import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({
  path: "./.env",
});

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "Options"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PROT || 4000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/about-us", (req, res) => {
  res.send("This is about us page");
});

app.get("/contact-us", (req, res) => {
  res.send("This is contact us page");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
