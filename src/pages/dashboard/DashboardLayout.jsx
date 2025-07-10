import React, { useContext, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaClipboardList, FaCalendarAlt, FaUser, FaBars, FaTimes } from "react-icons/fa";
import logo from "../../assets/wk-plan-logo.png";

function DashboardLayout() {
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-[var(--color-bg)] min-h-screen flex relative">

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded bg-[var(--color-accent)] text-white md:hidden"
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-60 p-4 flex flex-col bg-[var(--color-bg-card)] text-[var(--color-text)] border-r border-[var(--color-accent)] overflow-y-auto transform transition-transform duration-300 z-50
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <Link to="/" onClick={() => setSidebarOpen(false)}>
          <img
            src={logo}
            alt="WK-Plan logo"
            className="w-32 mx-auto mb-6"
            style={{ cursor: "pointer" }}
          />
        </Link>

        <nav className="flex flex-col gap-2 flex-grow">
          {[
            { to: "/dashboard/exercises", label: "Exercises", icon: <FaClipboardList /> },
            { to: "/dashboard/my-plans", label: "My Plans", icon: <FaCalendarAlt /> },
            { to: "/dashboard/profile", label: "Profile", icon: <FaUser /> },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`p-3 rounded-md font-medium transition flex items-center gap-3 pl-3 ${
                isActive(item.to)
                  ? "bg-[var(--color-accent)] text-white shadow-inner border-l-4 border-[var(--color-accent)]"
                  : "hover:bg-[var(--color-accent)] hover:text-white"
              }`}
            >
              <span className={`text-lg ${
                isActive(item.to) ? "text-white" : "text-[var(--color-accent)]"
              }`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}

          <div className="flex-grow" />

          <Link
            to="/dashboard/create-plan"
            onClick={() => setSidebarOpen(false)}
            className="p-3 rounded-md font-semibold text-center bg-white text-[var(--color-accent)] border border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition shadow-md"
          >
            Create Plan
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-4 p-3 rounded-md font-semibold text-center bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white transition shadow-md"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-60 px-6 sm:px-8 pb-4 pt-16 md:pt-8 bg-[var(--color-bg)] transition-all">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;