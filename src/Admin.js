import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebase";
import './ToDoApp.css';

export default function Admin() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });

  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const tasksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);
      
      const completed = tasksData.filter(task => task.completed).length;
      setStats({
        total: tasksData.length,
        completed,
        pending: tasksData.length - completed
      });
    };

    fetchTasks();
  }, []);

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to delete all tasks?")) {
      const batch = [];
      tasks.forEach(task => {
        batch.push(deleteDoc(doc(db, "tasks", task.id)));
      });
      await Promise.all(batch);
      setTasks([]);
      setStats({ total: 0, completed: 0, pending: 0 });
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'tasks-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <div className="sidebar-menu">
          <button className="menu-item" onClick={() => navigate("/app")}>
            <i className="fas fa-arrow-left"></i>
            <span>Back to App</span>
          </button>
        </div>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn btn-primary">
            Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        <h1>Admin Dashboard</h1>
        
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p>{stats.total}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p>{stats.completed}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p>{stats.pending}</p>
          </div>
        </div>

        <div className="admin-controls">
          <button className="btn btn-primary" onClick={handleExport}>
            Export All Tasks
          </button>
          <button className="btn btn-secondary" onClick={handleClearAll}>
            Clear All Tasks
          </button>
        </div>

        <div className="task-list-container">
          <h2>All Tasks</h2>
          <div className="task-list">
            {tasks.map(task => (
              <div key={task.id} className="task-item">
                <div className="task-content">
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">
                    <span>By: {task.userEmail || 'Unknown'}</span>
                    <span>Priority: {task.priority}</span>
                    <span>Status: {task.completed ? 'Completed' : 'Pending'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}