import "./Chat.css";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "./Contexts.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
function Chat(){
    const {newChat, prevChats, reply} = useContext(MyContext);
    const [latestReply, SetlatestReply] = useState(null);
    const chatHistory = Array.isArray(prevChats) ? prevChats : [];

    useEffect(() =>{
        if(reply === null){
            SetlatestReply(null);
            return;
        }
        if(!chatHistory.length || !reply) return;
        const content = reply.split(" ");
        let idx = 0;
        const interval = setInterval(() =>{
            SetlatestReply(content.slice(0, idx+1).join(" "));
            idx++;
            if(idx>= content.length) clearInterval(interval);
        }, 50 );
        return() => clearInterval(interval);
    }, [chatHistory.length, reply]);
    return (
        <>
        {chatHistory.length === 0 && <h1>What is on the agenda today?</h1>}
        <div className="chats">
            {chatHistory.slice(0, -1).map((chat, idx) => (
                <div className={chat.role === "user" ? "userDiv" : "aiDiv"} key={idx}>
                    {chat.role === "user" ? (
                        <p className="userMsg">{chat.content}</p>
                    ) : (
                        <div className="aiMsg">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                        </div>
                    )}
                </div>
            ))}

            {chatHistory.length > 0 && latestReply != null && (
                <div className="aiDiv" key={"typing-preview"}>
                    <div className="aiMsg">
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
        </>
    )
}
export default Chat;