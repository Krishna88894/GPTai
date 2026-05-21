import "./ChatWindow.css"
import Chat from "./Chat.jsx"
function ChatWindow(){
    return (
       
        <div className="chatWindow">
            <div className="navbar">
            <span>GPTai
                <i class="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv">
                    <span className="userIcon"><i class="fa-solid fa-user"></i></span>
                </div>
            </div>
            <div className="chatInput">
                <div className="InputBox">
                    <input placeholder="Ask Anything">
                    </input>
                    <div id="submit"><i class="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                GPTai can make mistakes. Check important infomation. 
                </p>
            </div>
        </div>
       
    )
}
export default ChatWindow;