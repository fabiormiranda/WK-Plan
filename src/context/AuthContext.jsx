import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keep localStorage updated when user or token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [token, user]);

  // Verify token with backend on initial load
  const authenticateUser = async () => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const response = await axios.get(`${API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        console.log("Valid token, user:", response.data);
        setUser(response.data);
        setToken(storedToken);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Invalid or expired token", err.response?.data || err.message);
        setUser(null);
        setToken(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  };

  // Login: set user and token received from backend
  const loginUser = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    setIsLoggedIn(true);
  };

  // Logout: clear user and token
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        isLoading,
        error,
        loginUser,
        logoutUser,
        authenticateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}