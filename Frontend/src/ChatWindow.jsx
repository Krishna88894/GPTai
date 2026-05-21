import "./ChatWindow.css"
import Chat from "./Chat.jsx"
import {MyContext} from "./Contexts.jsx"
import { useContext } from "react"
function ChatWindow(){
    const {prompt, Setprompt, reply, Setreply, currThreadId, SetcurrThreadId} = useContext(MyContext);
    const getReply = async ()=>{
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
            const rr = await response.json();
            Setreply(rr.reply ?? "");
            console.log(rr);
        }
        catch(error){
            console.error(error);
        }
    }

    return (
        <div className="chatWindow">
            <div className="navbar">
            <span>GPTai
                <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv">
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>

            <div className="chatInput">
                <div className="InputBox">
                    <input placeholder="Ask Anything" value={prompt}
                    onChange={(e) => Setprompt(e.target.value)}> 
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