import React, { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function DashboardLayout() {
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar lateral */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-8">WK-Plan Dashboard</h2>
        <nav className="flex flex-col gap-4 flex-grow">
          <Link to="/dashboard" className="hover:bg-gray-700 p-2 rounded">
            Exercises
          </Link>
          <Link to="/dashboard/my-plans" className="hover:bg-gray-700 p-2 rounded">
            My Plans
          </Link>
          <Link to="/dashboard/profile" className="hover:bg-gray-700 p-2 rounded">
            Profile
          </Link>
          <Link
            to="/dashboard/create-plan"
            className="mt-auto bg-blue-600 hover:bg-blue-700 text-center p-3 rounded font-semibold cursor-pointer"
          >
            Create Plan
          </Link>
        </nav>

        {/* Botão Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 hover:bg-red-700 p-3 rounded font-semibold cursor-pointer"
        >
          Logout
        </button>
      </aside>

      {/* Área principal */}
      <main className="flex-grow bg-gray-100 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
