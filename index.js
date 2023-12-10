import express from "express";
import cors from "cors";
const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());

import bcrypt from "bcrypt";
import mongoose from "mongoose";
import multer from "multer";
import {
  registerValidator,
  loginValidator,
  postCreateValidator,
} from "./validations.js";
import { validationResult } from "express-validator";

const PORT = 4444;

import { UserController, PostController } from "./controllers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";

// Подключение к БД MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB OK");
  })
  .catch((err) => {
    console.log("DB Error", err);
  });

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Hello world");
});

// POST /AUTH/LOGIN
app.post(
  "/auth/login",
  handleValidationErrors,
  loginValidator,
  UserController.login
);
// POST /AUTH/REGISTER
app.post(
  "/auth/register",
  registerValidator,
  handleValidationErrors,
  UserController.register
);
// GET User Info
app.get("/auth/me", checkAuth, UserController.getMe);

// UPLOAD
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  // console.log("req.file => ", req.file.originalname);
  return res.json({
    url: `/uploads/${req.file.filename}`,
  });
});
app.get("/tags", PostController.getLastTags);

// Create Article
app.get("/posts", PostController.getAll);
app.get("/posts/tags", PostController.getLastTags);
app.post(
  "/posts",
  checkAuth,
  postCreateValidator,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidator,
  handleValidationErrors,
  PostController.update
);
app.get("/posts/:id", PostController.getOne);

app.listen(process.env.PORT || 4444, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log(`Server запущен на порту ${process.env.PORT || 4444}`);
});
