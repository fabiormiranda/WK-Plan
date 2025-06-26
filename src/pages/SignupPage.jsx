import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      // Faz o POST diretamente com axios
      await axios.post(`${API_URL}/signup`, { name, email, password });
      
      alert("Conta criada com sucesso! Agora faz login.");
      navigate("/login");
    } catch (err) {
      // Se o backend enviar mensagem de erro, captura aqui
      const message = err.response?.data?.message || "Erro no registo";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Create Account</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          className="w-full p-2 border mb-4"
          placeholder="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border mb-4"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border mb-4"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-green-500 text-white p-2 rounded" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
