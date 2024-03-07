'use client'

import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const isAuthenticated = user !== null;

  const mockUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: "123456"
  };

  const login = (username, password) => {
    // Mock validation logic
    if (username === mockUser.username && password === mockUser.password) {
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const signup = (username, email, password) => {
    // For mock purposes, just log the new user details
    console.log("Signup with:", username, email, password);
    setUser({ username, email });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user,isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

