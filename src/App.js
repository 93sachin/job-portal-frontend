import React from "react";
import { Routes, Route, Navigate, useNavigate} from "react-router-dom";
import Dashboard from "./Dashboard";
import MyApplications from "./MyApplications";
import RecruiterDashboard from "./RecruiterDashboard";
import Login from "./Login";

// ================= PROTECTED ROUTE =================
function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role");
  
  if (!token) return <Navigate to="/" />;
  
  if (allowedRole && role !== allowedRole)
    return <Navigate to="/" />;

  return children;
}


// ================= MAIN APP =================
function App() {
  return (
    <Routes>

      {/* Login Route */}
      <Route path="/" element={<Login />} />

      {/* Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="student">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Recruiter Dashboard */}
      <Route
        path="/recruiter-dashboard"
        element={
          <ProtectedRoute allowedRole="recruiter">
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      /> 

      {/* My Applications Route */}
      <Route
        path="/my-applications"
        element={
          <ProtectedRoute>
            <MyApplications />
          </ProtectedRoute>
        }
      /> 

    </Routes>
  );
}

export default App;