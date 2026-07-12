import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import Fleet from "../pages/Fleet";
import Drivers from "../pages/Drivers";
import Trips from "../pages/Trips";
import Maintenance from "../pages/Maintenance";
import Fuel from "../pages/Fuel";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
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
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/fuel" element={<Fuel />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
