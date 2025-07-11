import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// Load API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

function SignupPage() {
  // State for user input and error handling
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * Handle form submission for user signup
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Send POST request to backend for user signup
      await axios.post(`${API_URL}/auth/signup`, { name, email, password });

      // Show success toast
      toast.success("Account created successfully! 🎉 Redirecting to login...", {
        style: {
          background: "var(--color-bg-card)",
          color: "var(--color-text)",
          border: "1px solid var(--color-accent)",
        },
        iconTheme: {
          primary: "var(--color-accent)",
          secondary: "var(--color-bg)",
        },
      });

      // Redirect to login page after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      // Display error message if signup fails
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Signup failed. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 bg-[var(--color-bg)] text-[var(--color-text)]">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col gap-6 bg-[var(--color-bg-card)] text-[var(--color-text)]"
      >
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center text-[var(--color-accent)]">
          Create Your WK-Plan Account
        </h2>

        {/* Display error message if signup fails */}
        {error && <p className="text-red-400 text-center">{error}</p>}

        {/* Name input */}
        <input
          className="w-full p-3 rounded bg-white text-black placeholder-gray-500 border border-gray-300 focus:border-[var(--color-accent)] outline-none transition"
          placeholder="Name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Email input */}
        <input
          className="w-full p-3 rounded bg-white text-black placeholder-gray-500 border border-gray-300 focus:border-[var(--color-accent)] outline-none transition"
          placeholder="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password input */}
        <input
          className="w-full p-3 rounded bg-white text-black placeholder-gray-500 border border-gray-300 focus:border-[var(--color-accent)] outline-none transition"
          placeholder="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Submit button */}
        <button
          className="w-full py-3 rounded bg-[var(--color-accent)] text-white font-bold text-lg tracking-wide shadow hover:bg-[var(--color-accent-dark)] transition"
          type="submit"
        >
          Register
        </button>

        {/* Link to Login */}
        <div className="text-sm text-[var(--color-muted)] text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--color-accent)] hover:underline font-semibold">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignupPage;
