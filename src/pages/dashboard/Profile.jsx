import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) return <p>You are not logged in.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      {/* Adiciona mais campos do perfil se quiseres */}
    </div>
  );
}

export default Profile;
