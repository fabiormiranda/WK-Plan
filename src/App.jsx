import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { AuthProvider } from "./context/AuthContext";

import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Exercises from "./pages/dashboard/Exercises"; 
import MyPlans from "./pages/dashboard/MyPlans";
import Profile from "./pages/dashboard/Profile";
import CreatePlan from "./pages/dashboard/CreatePlan";
import MyPlanDetail from "./pages/dashboard/MyPlanDetail";
import ChangePassword from "./pages/dashboard/ChangePassword.jsx";

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
              <Route path="create-plan" element={<CreatePlan />} />
              <Route path="exercises" element={<Exercises />} />
              <Route path="my-plans" element={<MyPlans />} />
              <Route path="/dashboard/my-plans/:planId" element={<MyPlanDetail />} />
              <Route path="profile" element={<Profile />} />
              <Route path="/dashboard/change-password" element={<ChangePassword />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
