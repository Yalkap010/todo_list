// Admin.js
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export default function Admin() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p id="totalTasks">0</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p id="completedTasks">0</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p id="pendingTasks">0</p>
        </div>
      </div>
      <div className="admin-controls">
        <button className="btn btn-primary" id="exportBtn">
          Export All Tasks
        </button>
        <button className="btn btn-secondary" id="clearAllBtn">
          Clear All Tasks
        </button>
      </div>
      <button onClick={handleLogout} className="btn btn-primary">
        Logout
      </button>
    </div>
  );
}