import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./Contexts.jsx";
import {v1 as uuidv1} from "uuid";
import blackLogo from "./assets/blacklogo.png";
import { apiUrl } from "./api.js";
function Sidebar(){
    const {allThreads, SetallThreads, currThreadId, SetnewChat, Setprompt, Setreply, SetprevChats, SetcurrThreadId} = useContext(MyContext);
    const getAllthreads= async() =>{
        try{
           const response = await fetch(apiUrl("/thread"));
           const res = await response.json();
           const datafiltered = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
           SetallThreads(datafiltered);
        }
        catch(err){
            console.log(err);
        }
    };
    useEffect(() =>{
        getAllthreads();
    }, [currThreadId]);

    const NewChatCreate = () =>{
        SetnewChat(true);
        Setprompt("");
        Setreply(null);
        SetcurrThreadId(uuidv1());
        SetprevChats([]);
    }
    const Threadchange = async(newThreadId) =>{
        SetcurrThreadId(newThreadId);
        try{
            const response = await fetch(apiUrl(`/thread/${newThreadId}`)); 
            const res = await response.json();
            console.log(res);
            SetprevChats(Array.isArray(res) ? res : []);
            SetnewChat(false);
            Setreply(null);
        }
        catch(err){
            console.log(err);
        }
    }
    const deleteThread = async(threadId) =>{
        try{
            const response = await fetch(apiUrl(`/thread/${threadId}`), {method: "DELETE"});
            const res = response.json();
            console.log(res);
            SetallThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if(threadId === currThreadId){
                NewChatCreate();
            }
        }
        catch(err){
            console.log(err);
        }
    }
    return (
        <section className="sidebar">
            <button onClick={NewChatCreate}>
                <img src={blackLogo} className="logo" alt="GPT Logo" />
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>
            <ul className="history">
            {
                allThreads.map((thread) =>(
                    <li key={thread.threadId} onClick={(e) => Threadchange(thread.threadId)}>{thread.title}
                    <i className="fa-solid fa-trash"
                    onClick={(e) =>{
                        e.stopPropagation();
                        deleteThread(thread.threadId);
                    }}></i>
                    </li>
                ))
            }
            </ul>

            <div className="sign">
                <p>Made with &hearts;</p>
            </div>
        </section>
    )
}
export default Sidebar;