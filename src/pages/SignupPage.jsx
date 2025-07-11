import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

function SignupPage() {
  // State for user input fields and error message
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Handles the form submission for user registration
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form reload
    setError(null); // Clear previous errors

    try {
      // Send POST request to signup endpoint with user data
      await axios.post(`${API_URL}/auth/signup`, { name, email, password });

      // Show success toast and redirect to login after 2 seconds
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
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      // Get error message from response or use a default message
      const message = err.response?.data?.message || "Signup failed. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 bg-[var(--color-bg)] text-[var(--color-text)]">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col gap-6 bg-[var(--color-bg-card)] text-[var(--color-text)]"
      >
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center text-[var(--color-accent)]">
            Create Your WK-Plan Account
          </h2>
        </div>

        {/* Display error message if there is one */}
        {error && <p className="text-red-400 text-center">{error}</p>}

        {/* Input for user name */}
        <input
          className="w-full p-3 rounded bg-white text-black placeholder-gray-500 border border-gray-300 focus:border-[var(--color-accent)] outline-none transition"
          placeholder="Name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Input for user email */}
        <input
          className="w-full p-3 rounded bg-white text-black placeholder-gray-500 border border-gray-300 focus:border-[var(--color-accent)] outline-none transition"
          placeholder="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Input for user password */}
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

        {/* Link to login page for users who already have an account */}
        <div className="text-sm text-[var(--color-muted)] text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[var(--color-accent)] hover:underline font-semibold"
          >
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignupPage;