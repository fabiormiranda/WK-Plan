import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create AuthContext to share authentication state across the app
export const AuthContext = createContext();

// AuthProvider component to wrap around your App
export function AuthProvider({ children }) {
  // User state: stores logged-in user data
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Token state: stores JWT token for authentication
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // Tracks if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Tracks if the authentication verification is still loading
  const [isLoading, setIsLoading] = useState(true);

  // Stores potential error messages (optional use for UI feedback)
  const [error, setError] = useState(null);

  // Keep localStorage updated whenever user or token changes
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

  // Verify token with the backend when the app loads
  const authenticateUser = async () => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const response = await axios.get(`${API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        console.log("Token is valid, user data:", response.data);
        setUser(response.data);
        setToken(storedToken);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Invalid or expired token:", err.response?.data || err.message);
        setUser(null);
        setToken(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      // No token found; user is not logged in
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  };

  // Log in the user and set their data and token
  const loginUser = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    setIsLoggedIn(true);
  };

  // Log out the user and clear their data and token
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
  };

  // Run token verification on initial mount
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
