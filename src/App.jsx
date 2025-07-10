import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Exercises from "./pages/dashboard/Exercises";
import ExerciseDetailPage from "./pages/dashboard/ExerciseDetailPage";
import AddExercise from "./pages/dashboard/AddExercise";
import EditExercise from "./pages/dashboard/EditExercise";
import DeleteExercise from "./pages/dashboard/DeleteExercise";
import MyPlans from "./pages/dashboard/MyPlans";
import MyPlanDetail from "./pages/dashboard/MyPlanDetail";
import CreatePlan from "./pages/dashboard/CreatePlan";
import Profile from "./pages/dashboard/Profile";
import ChangePassword from "./pages/dashboard/ChangePassword";
import NotFoundPage from "./pages/NotFoundPage";
import Loading from "./components/Loading";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Navbar */}
          <Route
            element={
              <>
                <Navbar />
                <Outlet />
              </>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Dashboard Routes */}
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
              <Route path="add-exercise" element={<AddExercise />} />
              <Route path="edit-exercise/:exerciseId" element={<EditExercise />} />
              <Route path="delete-exercise/:exerciseId" element={<DeleteExercise />} />
              <Route path="my-plans" element={<MyPlans />} />
              <Route path="my-plans/:planId" element={<MyPlanDetail />} />
              <Route path="profile" element={<Profile />} />
              <Route path="change-password" element={<ChangePassword />} />
              {/* Dashboard 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>

          {/* Global 404 without Navbar */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
              fontSize: "0.9rem",
            },
            success: {
              style: {
                background: "#2d6a4f",
              },
            },
            error: {
              style: {
                background: "#b02a37",
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;