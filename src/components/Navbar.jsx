import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/wk-plan-logo.png";

/**
 * Navbar component for WK-Plan.
 * - Hides on dashboard pages.
 * - Displays navigation links for Home, Login, and Signup.
 * - Responsive: uses a hamburger menu on mobile.
 */
function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide navbar on dashboard pages for a cleaner dashboard interface
  if (location.pathname.startsWith("/dashboard")) {
    return null;
  }

  // Define navigation links
  const links = [
    { to: "/", label: "Home" },
    { to: "/login", label: "Login" },
    { to: "/signup", label: "Signup" },
  ];

  return (
    <nav
      className="shadow flex items-center justify-between px-4 sm:px-6 py-3 sticky top-0 z-50"
      style={{
        background: "var(--color-bg)",
        borderBottom: "1px solid var(--color-bg-card)",
      }}
    >
      {/* Logo linking to Home */}
      <div className="flex items-center gap-3">
        <Link to="/">
          <img
            src={logo}
            alt="WK-Plan logo"
            className="md:w-44 h-auto object-contain"
            style={{ cursor: "pointer" }}
          />
        </Link>
      </div>

      {/* Desktop navigation links */}
      <div className="hidden md:flex gap-4">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`rounded-lg px-4 py-2 font-medium transition ${
              location.pathname === link.to
                ? "bg-[var(--color-accent)] text-white shadow"
                : "text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile hamburger toggle */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden p-2 rounded text-[var(--color-accent)]"
        aria-label="Toggle menu"
      >
        {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="absolute top-16 left-0 w-full bg-[var(--color-bg)] flex flex-col items-center gap-2 py-4 border-t border-[var(--color-accent)] md:hidden z-40"
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`rounded-lg px-4 py-2 w-4/5 text-center font-medium transition ${
                location.pathname === link.to
                  ? "bg-[var(--color-accent)] text-white shadow"
                  : "text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
