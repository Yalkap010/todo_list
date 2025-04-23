import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  
  return (
    <div className="settings-container">
      <h2>App Settings</h2>
      <p>Configure your application settings here.</p>
      <button onClick={() => navigate("/app")} className="back-button">
        Back to To-Do List
      </button>
    </div>
  );
}        
