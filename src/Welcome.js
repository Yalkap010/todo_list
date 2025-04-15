import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();
  
  return (
    <div className="welcome-container">
      <h2>Welcome to Our App</h2>
      <p>This is the welcome page. You can navigate to other sections using the sidebar.</p>
      <button onClick={() => navigate("/todo")} className="back-button">
        Go to To-Do List
      </button>
    </div>
  );
}