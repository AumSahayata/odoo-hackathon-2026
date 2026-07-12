import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../components/DashboardLayout";

const NotFound = () => {
  return (
    <div
      style={{
        padding: "3rem",
        textAlign: "center",
        color: "#AEB4BE",
        backgroundColor: "#0E1013",
        minHeight: "100vh",
      }}
    >
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />{" "}
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
