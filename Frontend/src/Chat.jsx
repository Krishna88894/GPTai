import "./Chat.css";
import { useContext } from "react";
import { MyContext } from "./Contexts";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
function Chat(){
    const {newChat, prevChats} = useContext(MyContext);

    return (
        <>
        {newChat && <h1>What is on the agenda today?</h1>}
        <div className="chats">{
            prevChats?.map((chat, idx) =>
                <div className={chat.role === "user"? "userDiv" : "aiDiv"} key={idx}>
                    {
                        chat.role === "user" ? (
                            <p className="userMsg">{chat.content}</p>
                        ) : (
                            <div className="aiMsg">
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                            </div>
                        )
                    }
                </div>
            )
            }
        </div>
        </>
    )
}
export default Chat;