import "./Chat.css";
import { useContext } from "react";
import { MyContext } from "./Contexts";
function Chat(){
    const {newChat, prevChats} = useContext(MyContext);

    return (
        <>
        {newChat && <h1>What is on the agenda today?</h1>}
        <div className="chats">
            <div className="userDiv">
        <p className="userMsg">userMsg</p>
            </div>
            <div className="aiDiv">
        <p className="aiMsg">Generated Msg</p>
            </div>
        </div>
        </>
    )
}
export default Chat;