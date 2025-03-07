import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


export const generateTokenAndSetCookie = (res, userId, full_name, phone_number) => {

    const token = jwt.sign({userId, full_name, phone_number}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}