import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; 

import ToDoApp from "./ToDoApp";
import Register from "./Register";
import Login from "./Login";
import Settings from './Settings';
import Welcome from './Welcome';
import FilterSort from './FilterSort';
import Admin from './Admin'; 

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      
      setIsAdmin(user?.email?.includes('admin')); 
    });
    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/app" element={user ? <ToDoApp /> : <Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/filter" element={<FilterSort />} />
      <Route 
        path="/admin" 
        element={isAdmin ? <Admin /> : <Navigate to="/" />} 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
