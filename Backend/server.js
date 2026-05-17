import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import cRoutes from "./routes/chat.js";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
const app = express();
const PORT= 8080;

app.use(express.json());
app.use(cors());
app.use("/", cRoutes);

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
    connectDb();
});

const connectDb = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected");
    }
    catch(err){
        console.log("Connection Failed :", err);
    }
};

