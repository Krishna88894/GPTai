import express from "express";
import Thread from "../models/Thread.js";
import geminiResponse from "../utils/gemini.js"

const router = express.Router();

router.post("/test", async(req, res) =>{
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

router.get("/thread", async(req, res) =>{
    try{
        const threadsAll = await Thread.find({}).sort({updatedAt: -1});
        res.send(threadsAll);
    }
    catch(err){
        res.send(err.message);
    }
})

router.get("/thread/:threadId", async(req, res) =>{
    const {threadId} = req.params;
    try{
        const thread = await Thread.findOne({threadId});
        if(!thread){
            return res.status(400).json({error: "Not found"});
        }
        res.send(thread.messages);
    }
    catch(err){
        res.send(err.message);
    }
});

router.delete("/thread/:threadId", async(req, res) => {
    const {threadId} = req.params;
    try{
        await Thread.findOneAndDelete({threadId});
        res.status(200).json({success: "Thread has been deleted"});
    }
    catch(error){
        res.send(error.message);
    }
});

router.post("/chat", async(req, res) =>{
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
        res.status(500).send(err.message);
    }
});

export default router;