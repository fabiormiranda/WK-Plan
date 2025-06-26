import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  // Esconder navbar em páginas do dashboard
  if (location.pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <nav className="bg-gray-100 p-4 flex gap-4 shadow">
      <Link to="/" className="font-bold text-blue-600">WK-Plan</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
    </nav>
  );
}

export default Navbar;