import express from "express";
import route from "./routes/auth-route.js";


const app = express();


app.use(express.json());

const PORT = 5000 || 3000;
 
app.use(route);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})