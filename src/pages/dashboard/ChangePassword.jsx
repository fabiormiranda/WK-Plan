import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";

const API_URL = import.meta.env.VITE_API_URL;

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.put(
  `${API_URL}/auth/change-password`,
  { currentPassword, newPassword },
  { headers: { Authorization: `Bearer ${token}` } }
);
        toast.success(res.data.message || "Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        navigate("/dashboard/profile");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to change password");
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-[var(--color-accent)]">
        Change Password
      </h1>

      {loading ? (
        <Loading />
      ) : (
        <form onSubmit={handleChangePassword} className="space-y-3">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full p-2 rounded border border-[var(--color-accent)] bg-[var(--color-bg-card)] text-[var(--color-text)] placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 rounded border border-[var(--color-accent)] bg-[var(--color-bg-card)] text-[var(--color-text)] placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            className="w-full p-2 rounded border border-[var(--color-accent)] bg-[var(--color-bg-card)] text-[var(--color-text)] placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-full bg-[var(--color-accent)] text-white py-2 rounded hover:opacity-90 transition"
          >
            Change Password
          </button>
        </form>
      )}
    </div>
  );
}

export default ChangePassword;
