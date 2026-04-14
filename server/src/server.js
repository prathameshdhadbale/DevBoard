import dotenv from "dotenv";
dotenv.config();


import express from "express";
import cors from "cors";
import "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
