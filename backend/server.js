import express from "express";
import dotenv from "dotenv";
import route from "./routes/auth-route.js";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = 5000 || 3000;
 
app.use(route);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})