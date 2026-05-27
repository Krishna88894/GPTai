import express from "express";
import mongoose from "mongoose";
import Thread from "../models/Thread.js";
import geminiResponse from "../utils/gemini.js"

const router = express.Router();

const requireMongo = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ error: "Database is unavailable" });
    }

    next();
};

router.post("/test", requireMongo, async(req, res) =>{
    try{
        const thread = new Thread({
            threadId:"568",
            title: "sent"
        });
        const response = await thread.save();
        res.send(response);
    }
    catch(err){
        res.status(500).json({error:"failed"});
    }
});

router.get("/thread", requireMongo, async(req, res) =>{
    try{
        const threadsAll = await Thread.find({}).sort({updatedAt: -1});
        res.send(threadsAll);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
})

router.get("/thread/:threadId", requireMongo, async(req, res) =>{
    const {threadId} = req.params;
    try{
        const thread = await Thread.findOne({threadId});
        if(!thread){
            return res.status(400).json({error: "Not found"});
        }
        res.send(thread.messages);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.delete("/thread/:threadId", requireMongo, async(req, res) => {
    const {threadId} = req.params;
    try{
        await Thread.findOneAndDelete({threadId});
        res.status(200).json({success: "Thread has been deleted"});
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
});

router.post("/chat", requireMongo, async(req, res) =>{
    const {threadId, message} = req.body;
    if(!threadId || !message){
        return res.status(400).json({error: "threadId and message are required"});
    }
    try{
        let thread = await Thread.findOne({threadId});
        const isNewThread = !thread;
        if(!thread){
            thread = new Thread({
                threadId,
                title: message,
                messages:[
                    {role:"user", content: message}
                ]
            });
        }
        else{
            thread.messages.push({role: "user", content: message});
        }

        await thread.save();

        const aireply = await geminiResponse(message);
        if(aireply){
            thread.messages.push({role:"assistant", content: aireply});
            thread.updatedAt = Date.now();
            await thread.save();
        }

        res.status(isNewThread ? 201 : 200).json({reply: aireply, threadId, created: isNewThread});
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

export default router;