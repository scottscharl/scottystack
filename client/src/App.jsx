import { Routes, Route, Navigate } from "react-router-dom";
import { usePocket } from "./context/PocketContext";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Home from "./routes/Home";
import Dashboard from "./routes/Dashboard";

function ProtectedRoute({ children }) {
  const { user } = usePocket();
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user } = usePocket();
  return !user ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
