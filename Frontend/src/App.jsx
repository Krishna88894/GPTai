import './App.css'
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from './Contexts.jsx';
function App() {
  const valueProviders = {};
  return (
    <>
     <div className="main">
      <MyContext.Provider values = {valueProviders}></MyContext.Provider>
      <Sidebar></Sidebar>
      <ChatWindow> </ChatWindow>
     </div>
    </>
  )
}

export default App
