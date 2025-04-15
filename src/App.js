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
import Admin from './Admin'; // تأكد من وجود هذا الملف في مجلد src

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // تحقق إذا كان المستخدم admin (عدل الشرط حسب نظامك)
      setIsAdmin(user?.email?.includes('admin')); // مثال: إذا كان الإيميل يحتوي على كلمة "admin"
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
      {/* إضافة Route للإدمن مع تحقق من الصلاحيات */}
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