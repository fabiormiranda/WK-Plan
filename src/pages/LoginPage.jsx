import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Loading from "../components/Loading";


const API_URL = "https://wk-plan-backend.onrender.com/api/auth";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loadingLocal, setLoadingLocal] = useState(false);

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoadingLocal(true);

    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const data = response.data;

      loginUser(
        { userId: data.userId, name: data.name, email: data.email },
        data.token
      );

      navigate("/dashboard/exercises");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
      setLoadingLocal(false);
    }
  };

  if (loadingLocal) {
    return <Loading />;
  }

  return (
    <div
      className="min-h-[80vh] flex flex-col justify-center items-center px-4 bg-[var(--color-bg)] text-[var(--color-text)]"
    >
      <form
        onSubmit={handleLogin}
        className="max-w-md w-full rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col gap-6 bg-[var(--color-bg-card)] text-[var(--color-text)]"
      >
        <div className="flex flex-col items-center mb-6">
        
          <h2
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center"
            style={{ color: "var(--color-accent)" }}
          >
            Login to WK-Plan
          </h2>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <input
          className="w-full p-3 rounded bg-[#18181b] border border-[var(--color-bg-card)] focus:border-[var(--color-accent)] outline-none transition"
          type="email"
          placeholder="Email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full p-3 rounded bg-[#18181b] border border-[var(--color-bg-card)] focus:border-[var(--color-accent)] outline-none transition"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loadingLocal}
          className={`w-full py-3 rounded text-white font-bold text-lg tracking-wide shadow transition ${
            loadingLocal
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)]"
          }`}
        >
          {loadingLocal ? "Logging in..." : "Login"}
        </button>
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
