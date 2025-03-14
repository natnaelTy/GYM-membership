import express from "express";
import { register, login, logout, verify } from "../controllers/auth-controller.js";
import multer from "multer";
import fs from "fs";


const route = express.Router();

const uploadDir = "./uploads";
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, {recursive: true});
}

const storage = multer.diskStorage({
    destination: function (req, file, cd){
        cd(null, "uploads/");
    },
    filename: function (req, file, cd){
       cd(null, Date.now() + "-" + file.originalname);
    }
})

const upload = multer({storage: storage});

route.post('/register', upload.single("image"), register);

route.post("/login", login);

route.post("/logout", logout);

route.get("/verify", verify);

export default route;