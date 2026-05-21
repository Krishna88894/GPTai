import './App.css'
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from './Contexts.jsx';
import {v1 as uuidv1} from "uuid";  
import { useState } from 'react';
function App() {
  const [prompt, Setprompt] = useState("");
  const [reply, Setreply] = useState(null);
  const [currThreadId, SetcurrThreadId] = useState(uuidv1());
  const [prevChats, SetprevChats] = useState([]);
  const [newChat, SetnewChat] = useState(true);
  const valueProviders = {
    prompt, Setprompt,
    reply, Setreply,
    currThreadId, SetcurrThreadId,
    newChat, SetnewChat,
    prevChats, SetprevChats
  };
  return (
    <>
     <div className="main">
      <MyContext.Provider value={valueProviders}>
      <Sidebar></Sidebar>
      <ChatWindow> </ChatWindow>
      </MyContext.Provider>
     </div>
    </>
  )
}

export default App
