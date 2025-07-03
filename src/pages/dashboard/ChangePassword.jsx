import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/auth/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      // Opcional: depois de mudar, voltar ao perfil
      setTimeout(() => {
        navigate("/dashboard/profile");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div style={{ color: "var(--color-text)" }} className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-accent)" }}>
        Change Password
      </h1>
      <form onSubmit={handleChangePassword}>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className="w-full mb-2 p-2 rounded border"
          style={{
            backgroundColor: "var(--color-bg-card)",
            color: "var(--color-text)",
            borderColor: "var(--color-accent)",
          }}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full mb-2 p-2 rounded border"
          style={{
            backgroundColor: "var(--color-bg-card)",
            color: "var(--color-text)",
            borderColor: "var(--color-accent)",
          }}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
          className="w-full mb-2 p-2 rounded border"
          style={{
            backgroundColor: "var(--color-bg-card)",
            color: "var(--color-text)",
            borderColor: "var(--color-accent)",
          }}
        />
        {message && <p className="text-green-500 mb-2">{message}</p>}
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          type="submit"
          className="bg-[var(--color-accent)] text-white px-4 py-2 rounded hover:bg-[var(--color-accent-dark)]"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
