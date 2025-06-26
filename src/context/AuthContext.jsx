import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://wk-plan-backend.onrender.com/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Lê o user e token do localStorage ao iniciar
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

  // Atualiza localStorage sempre que user/token mudam
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

  // Verifica token com o backend
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
        console.error("Token inválido ou expirado", err);
        setUser(null);
        setToken(null);
        setIsLoggedIn(false);
      }
    } else {
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);
    }

    setIsLoading(false);
  };

  // Login: define user e token recebidos
  const loginUser = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    setIsLoggedIn(true);
  };

  // Logout: limpa tudo
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
  };

  // Executa no arranque da app
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
