import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loading from "./Loading";

/**
 * PrivateRoute component to protect routes that require authentication.
 * - Shows a loading spinner while verifying the user's authentication status.
 * - Redirects to the login page if the user is not logged in.
 * - Renders the protected children if the user is authenticated.
 *
 * @param {Object} props
 * @param {ReactNode} props.children - The components to render if authenticated.
 */
function PrivateRoute({ children }) {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  // If the authentication status is still loading, show the loading spinner
  if (isLoading) {
    return <Loading />;
  }

  // If the user is not logged in, redirect to the login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected content
  return children;
}

export default PrivateRoute;
