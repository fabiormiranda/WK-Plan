import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Exercises from "./pages/dashboard/Exercises";
import MyPlans from "./pages/dashboard/MyPlans";
import Profile from "./pages/dashboard/Profile";
import CreatePlan from "./pages/dashboard/CreatePlan";
import ExerciseDetailPage from "./pages/dashboard/ExerciseDetailPage.jsx";
import MyPlanDetail from "./pages/dashboard/MyPlanDetail";
import ChangePassword from "./pages/dashboard/ChangePassword.jsx";

import PrivateRoute from "./components/PrivateRoute";
import Loading from "./components/Loading";

function AppContent() {
  const { isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Dashboard protegido */}
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="create-plan" element={<CreatePlan />} />
            <Route path="exercises" element={<Exercises />} />
            <Route path="exercises/:exerciseSlug" element={<ExerciseDetailPage />} />
            <Route path="my-plans" element={<MyPlans />} />
            <Route path="my-plans/:planId" element={<MyPlanDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
