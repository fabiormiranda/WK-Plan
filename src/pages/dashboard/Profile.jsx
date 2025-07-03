import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div style={{ color: "var(--color-text)" }}>
      <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-accent)" }}>
        Your Profile
      </h1>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <button
        onClick={() => navigate("/dashboard/change-password")}
        className="mt-4 bg-[var(--color-accent)] text-white px-4 py-2 rounded hover:bg-[var(--color-accent-dark)]"
      >
        Change Password
      </button>
    </div>
  );
}

export default Profile;
