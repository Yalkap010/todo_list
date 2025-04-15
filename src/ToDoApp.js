import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { signOut } from "firebase/auth";
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore"; // أضيف updateDoc
import { useNavigate, Link } from "react-router-dom";
import './ToDoApp.css';

export default function ToDoApp() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null); // إضافة حالة للتعديل
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    if (task) {
      await addDoc(collection(db, "tasks"), { text: task });
      setTask("");
    }
  };

  const removeTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  // دالة جديدة لتعديل المهام
  const editTask = async (id, newText) => {
    await updateDoc(doc(db, "tasks", id), { text: newText });
    setEditingTask(null);
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: "200px", background: "#673AB7", color: "white", padding: "20px" }}>
        <h2>Sign Up / Login</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>📝 To-Do</Link>
          <Link to="/welcome" style={{ color: "white", textDecoration: "none" }}>🏠 Welcome</Link>
          <Link to="/settings" style={{ color: "white", textDecoration: "none" }}>⚙️ Settings</Link>
          <Link to="/filter" style={{ color: "white", textDecoration: "none" }}>🔍 Filter / Sort</Link>
          <button onClick={logout} style={{ marginTop: "20px" }}>🚪 Logout</button>
        </nav>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h1>Список задач</h1>
        <input value={task} onChange={(e) => setTask(e.target.value)} placeholder="Введите задачу" />
        <button onClick={addTask}>Добавить</button>
        <ul>
          {tasks.map((t) => (
            <li key={t.id}>
              {editingTask?.id === t.id ? (
                <>
                  <input 
                    value={editingTask.text} 
                    onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })} 
                  />
                  <button onClick={() => editTask(t.id, editingTask.text)}>💾</button>
                </>
              ) : (
                <>
                  {t.text} 
                  <button onClick={() => setEditingTask({ id: t.id, text: t.text })}>✏️</button>
                  <button onClick={() => removeTask(t.id)}>🗑️</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}