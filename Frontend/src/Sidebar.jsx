import "./Sidebar.css";
function Sidebar(){
    return (
        <section className="sidebar">
            <button>
                <img src="src/assets/blacklogo.png" className="logo" alt="GPT Logo" />
                <span><i class="fa-solid fa-pen-to-square"></i></span>
            </button>
            <ul className="history">
            <li>history</li> 
            </ul>

            <div className="sign">
                <p>Made with &hearts;</p>
            </div>
        </section>
    )
}
export default Sidebar;