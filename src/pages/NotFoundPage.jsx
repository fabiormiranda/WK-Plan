import { useNavigate } from 'react-router-dom';
import logo from "../assets/404-logo.png";

// NotFoundPage component to handle 404 pages gracefully
export default function NotFoundPage() {
  const navigate = useNavigate(); // Allows programmatic navigation

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-4">
      {/* Logo image for the 404 page */}
      <img 
        src={logo} 
        alt="404 Dumbbell" 
        className="w-80 h-80 mb-3"
      />

      {/* Title for the 404 page */}
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
        Oops! You’ve wandered off the workout plan.
      </h1>

      {/* Subtitle explaining the 404 error to the user */}
      <p className="text-[var(--color-muted)] text-center mb-6">
        404 - This rep doesn’t exist! Let’s get you back on track.
      </p>

      {/* Button to navigate back to the homepage */}
      <button 
        onClick={() => navigate('/')} 
        className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-[var(--color-text)] font-semibold py-2 px-6 rounded-lg transition-colors"
      >
        Go Back Home
      </button>
    </div>
  );
}