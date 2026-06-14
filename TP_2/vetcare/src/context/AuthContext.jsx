import { createContext, useContext, useState } from 'react';
import usersData from '../data/users.json';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('vetcare_user');
    return saved ? JSON.parse(saved) : null;
  });

  function login(email, password) {
    const user = usersData.find(
      u => u.email === email && u.password === password
    );
    if (!user) return false;
    setCurrentUser(user);
    localStorage.setItem('vetcare_user', JSON.stringify(user));
    return true;
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem('vetcare_user');
  }

  const isAdmin = currentUser?.rol === 'admin';

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
