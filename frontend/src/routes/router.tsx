import {createBrowserRouter, Navigate}
from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import MyOrders from "../pages/MyOrders";
import AdminDashboard from "../pages/AdminDashboard";
import CreateUser from "../pages/CreateUser";
import ResetPassword
from "../pages/ResetPassword";

function AdminRoute({
  children
}: any) {

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      ) || "{}"
    );

  if (
    user.role !== "admin"
  ) {

    return (
      <Navigate to="/dashboard" />
    );

  }

  return children;

}


export const router =

createBrowserRouter([

  {
    path: "/",
    element: <Login />
  },

  {
    path: "/dashboard",
    element: <Dashboard />
  },

  {
    path: "/orders",
    element: <MyOrders />
  },

  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    )
  },

  {
    path: "/admin/users",
    element: (
      <AdminRoute>
        <CreateUser />
      </AdminRoute>
    )
  },

  {
    path:"/reset",
    element:<ResetPassword/>
  },

  {
    errorElement: (
      <div>
        Page Not Found
      </div>
    )
  }

]);
