import express from "express";
import { register, login, logout } from "../controllers/auth-controller.js";
import multer from "multer";

const route = express.Router();
const upload = multer({dest: "uploads/"});

route.post('/register', upload.single("profile"), register);

route.post("/login", login);

route.post("/logout", logout);


export default route;