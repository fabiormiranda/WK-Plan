import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://wkplan-backend.onrender.com/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Armazenar token e user no localStorage
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

  // Função para validar o token e obter os dados do user
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

  // loginUser recebe dados e token do login para armazenar
  const loginUser = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    setIsLoggedIn(true);
  };

  // logoutUser limpa tudo
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
