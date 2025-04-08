import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { signOut } from "firebase/auth";
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function ToDoApp() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
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

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div>
      <h1>Список задач</h1>
      <input value={task} onChange={(e) => setTask(e.target.value)} placeholder="Введите задачу" />
      <button onClick={addTask}>Добавить</button>
      <button onClick={logout}>Выйти</button>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.text} <button onClick={() => removeTask(t.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}