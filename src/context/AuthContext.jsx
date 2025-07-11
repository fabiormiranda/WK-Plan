import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [isLoading, setIsLoading] = useState(true);

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

  const authenticateUser = async () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const response = await axios.get(`${API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setUser(response.data);
        setToken(storedToken);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Token invalid/expired:", err.response?.data || err.message);
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

  const loginUser = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    setIsLoggedIn(true);
  };

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
      value={{ user, token, isLoggedIn, isLoading, loginUser, logoutUser, authenticateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
