import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';
import cRoutes from "./routes/chat.js";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
const app = express();
const PORT = process.env.PORT || 8080;

// Resolve __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
// Configure CORS from env (comma-separated list) or allow all when not set
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true;
app.use(cors({ origin: allowedOrigins }));
app.use("/", cRoutes);

// Health endpoint for load balancers / hosting platforms
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Serve frontend build in production when present
if (process.env.NODE_ENV === 'production') {
    const staticPath = path.join(__dirname, '..', 'Frontend', 'dist');
    app.use(express.static(staticPath));
    app.get('/', (req, res) => {
        res.sendFile(path.join(staticPath, 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

connectDb().catch(() => {
    console.error("MongoDB connection is unavailable. The server will stay up, but DB-backed routes will return 503.");
});

// Global handlers to log unexpected errors without immediately crashing the process
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

const connectDb = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("Database connected");
    }
    catch(err){
        console.log("Connection Failed :", err);
        throw err;
    }
};

async function startServer() {
    return;
}

