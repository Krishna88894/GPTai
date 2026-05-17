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
            res.status(400).json({error: "Not found"});
        }
        res.send(thread.messages);
    }
    catch(err){
        res.send(err.message);
    }
});

router.delete("/thread/:threadId", async(req, res) => {
    const {thread} = req.params;
    try{
        await Thread.findOneAndDelete({thread});
        res.status(200).json({success: "Thread has been deleted"});
    }
    catch(error){
        res.send(error.message);
    }
});

router.post("/chat", async(req, res) =>{
const {threadId, message} = req.body;
    if(!threadId || !message){ res.status(400).json({error: "Couldn't have the thread"})};
    try{
        const thread = await Thread.findOne({threadId});
        if(!thread){
            res.status(400).json({error:"Doesn't exist"})
            thread = new Thread({
                threadId,
                title: message,
                messages:[
                    {role:"user", parts:[{text: message}]}
                ]
        });
    }
    else{
        thread.message.push({role: "user", parts:[{text: message}]});
    }
    const aireply = await geminiResponse(message);
    thread.messages.push({role:"assistant", content:"aireply"});
    thread.updatedAt = Date.now();
    await thread.save();
    res.json({reply: aireply});
}
    catch(err){
        res.send(err.message);
    }
});

export default router;