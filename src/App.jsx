import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { AuthProvider } from "./context/AuthContext";

import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Profile from "./pages/dashboard/Profile";
import Exercises from "./pages/dashboard/DashboardHome"; // Usar DashboardHome para Exercises
import MyPlans from "./pages/dashboard/MyPlans";
import CreatePlan from "./pages/dashboard/CreatePlan";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="p-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Dashboard com layout */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="exercises" element={<Exercises />} />
              <Route path="my-plans" element={<MyPlans />} />
              <Route path="profile" element={<Profile />} />
              <Route path="create-plan" element={<CreatePlan />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
