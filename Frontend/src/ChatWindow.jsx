import "./ChatWindow.css"
import Chat from "./Chat.jsx"
import {MyContext} from "./Contexts.jsx"
import { useContext, useState, useEffect } from "react"
import {ScaleLoader} from "react-spinners";
function ChatWindow(){
    const {prompt, Setprompt, reply, Setreply, prevChats, SetprevChats, currThreadId, SetcurrThreadId, newChat} = useContext(MyContext);
    const [loading, setloading] = useState(false);
    const [isOpen, SetisOpen] = useState(false);
    const getReply = async ()=>{
        setloading(true);
        const options ={
            method:"POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId,
            }),
        };
        try{
            const response = await fetch("http://localhost:8080/chat", options);
            const responseText = await response.text();
            let responseData = {};

            try{
                responseData = responseText ? JSON.parse(responseText) : {};
            }
            catch(parseError){
                responseData = {error: responseText || "Unexpected server response"};
            }

            if(!response.ok){
                throw new Error(responseData.error || responseData.message || "Failed to get reply");
            }
            Setreply(responseData.reply ?? "No reply received");
            console.log(responseData);
        }
        catch(error){
            console.error(error);
            Setreply(error.message);
        }
        finally{
            setloading(false);
        }
    }
    useEffect(() =>{
        if(prompt && reply){
            SetprevChats(prev => [
                ...prev,
                { role: 'user', content: prompt },
                { role: 'assistant', content: reply }
            ]);
        }
        Setprompt("");
    }, [reply]);

    return (
        <div className="chatWindow">
            <div className="navbar">
            <span>GPTai
                <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv">
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
        {
            isOpen &&
            <div className="dropdown">
                <div className="dropItems"><i className="fa-solid fa-arrow-right-from-bracket"></i>Logout</div>
            </div>
        }

            <div className="chatBody">
                    <Chat />
        <ScaleLoader color= "#fff" loading={loading}></ScaleLoader>
            </div>
            <div className="chatInput">
                <div className="InputBox">
                    <input placeholder="Ask Anything" value={prompt}
                    onChange={(e) => Setprompt(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}>
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                GPTai can make mistakes. Check important infomation. 
                </p>
            </div>
        </div>
       
    )
}
export default ChatWindow;