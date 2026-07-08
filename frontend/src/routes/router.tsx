import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import UserManagement from "../pages/UserManagement";
import ResetPassword from "../pages/ResetPassword";

function AdminRoute({ children }: any) {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },

  {
    path: "/dashboard",
    element: <Dashboard />,
  },

  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },

  {
    path: "/admin/users",
    element: (
      <AdminRoute>
        <UserManagement />
      </AdminRoute>
    ),
  },

  {
    path: "/reset",
    element: <ResetPassword />,
  },

  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold">
        404 - Page Not Found
      </div>
    ),
  },
]);