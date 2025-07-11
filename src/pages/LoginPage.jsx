import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Loading from "../components/Loading";

// Load API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

function LoginPage() {
  // State for user input and loading/error feedback
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loadingLocal, setLoadingLocal] = useState(false);

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Handle form submission for login
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoadingLocal(true);

    try {
      // Send login request to backend with user credentials
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const data = response.data;

      // Update AuthContext immediately with user and token
      loginUser(data.user, data.token);

      // Navigate to the exercises dashboard upon successful login
      navigate("/dashboard/exercises");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Please try again."
      );
      setLoadingLocal(false);
    }
  };

  // Show loading spinner during login request
  if (loadingLocal) return <Loading />;

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 bg-[var(--color-bg)] text-[var(--color-text)]">
      <form
        onSubmit={handleLogin}
        className="max-w-md w-full rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col gap-6 bg-[var(--color-bg-card)] text-[var(--color-text)]"
      >
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center text-[var(--color-accent)]">
          Login to WK-Plan
        </h2>

        {/* Display error message if login fails */}
        {error && <p className="text-red-400 text-center">{error}</p>}

        {/* Email input */}
        <input
          className="w-full p-3 rounded bg-white text-black placeholder-gray-500 border border-gray-300 focus:border-[var(--color-accent)] outline-none transition"
          type="email"
          placeholder="Email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password input */}
        <input
          className="w-full p-3 rounded bg-white text-black placeholder-gray-500 border border-gray-300 focus:border-[var(--color-accent)] outline-none transition"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={loadingLocal}
          className={`w-full py-3 rounded text-white font-semibold text-lg tracking-wide shadow transition ${
            loadingLocal
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)]"
          }`}
        >
          {loadingLocal ? "Logging in..." : "Login"}
        </button>

        {/* Link to Signup */}
        <div className="text-sm text-[var(--color-muted)] text-center">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[var(--color-accent)] hover:underline font-semibold"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
