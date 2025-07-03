import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_URL = "https://wk-plan-backend.onrender.com/api/auth";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post(`${API_URL}/signup`, { name, email, password });
      alert("Conta criada com sucesso! Agora faz login.");
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "Erro no registo";
      setError(message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--color-bg-card)] rounded-2xl shadow-xl w-full max-w-sm p-8 flex flex-col gap-4"
      >
        <div className="flex flex-col items-center mb-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5956/5956416.png"
            alt="WK-Plan logo"
            className="w-14 h-14 mb-2"
          />
          <h2
            className="text-2xl font-extrabold mb-2 tracking-tight"
            style={{ color: "var(--color-accent)" }}
          >
            Create Account
          </h2>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <input
          className="w-full p-3 rounded bg-[#18181b] border border-[var(--color-bg-card)] focus:border-[var(--color-accent)] outline-none transition mb-2"
          placeholder="Name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full p-3 rounded bg-[#18181b] border border-[var(--color-bg-card)] focus:border-[var(--color-accent)] outline-none transition mb-2"
          placeholder="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full p-3 rounded bg-[#18181b] border border-[var(--color-bg-card)] focus:border-[var(--color-accent)] outline-none transition mb-2"
          placeholder="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full py-3 rounded bg-[var(--color-accent)] text-white font-bold text-lg tracking-wide shadow hover:bg-[var(--color-accent-dark)] transition"
          type="submit"
        >
          Register
        </button>
        <div className="text-sm text-[var(--color-muted)] text-center mt-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[var(--color-accent)] hover:underline font-semibold"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignupPage;
