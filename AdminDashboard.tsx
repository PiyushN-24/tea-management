import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<any[]>([]);
  const [summary, setSummary] = useState({ tea: 0, coffee: 0 });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const [consumption, totals, trend] = await Promise.all([
        api.get("/admin/consumption"),
        api.get("/admin/summary"),
        api.get("/admin/trend"), // 👈 add this backend endpoint if possible
      ]);

      setUsers([...consumption.data]);
      setSummary({ ...totals.data });
      setChartData(trend.data || []);
    } catch (e) {
      console.log(e);
    }
  }

  function logout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-indigo-700 to-indigo-950 text-white p-6">
        <h1 className="text-2xl font-bold">☕ Tea Management</h1>

        <div className="mt-10 space-y-3">
          <button className="w-full text-left p-3 rounded-lg bg-white/10">
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="w-full text-left p-3 rounded-lg bg-white/10"
          >
            Create User
          </button>

          <button
            className="w-full text-left p-3 rounded-lg bg-white/10"
            onClick={() =>
              window.open("http://127.0.0.1:8000/admin/export", "_blank")
            }
          >
            Export CSV
          </button>

          <button
            onClick={logout}
            className="w-full text-left p-3 rounded-lg bg-red-500 mt-10"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-8 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">
              Tea & Coffee analytics overview
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-gray-500">Total Tea</p>
            <h2 className="text-4xl font-bold text-green-600">
              🍵 {summary.tea}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-gray-500">Total Coffee</p>
            <h2 className="text-4xl font-bold text-orange-500">
              ☕ {summary.coffee}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-gray-500">Total Orders</p>
            <h2 className="text-4xl font-bold text-blue-600">
              {summary.tea + summary.coffee}
            </h2>
          </div>

        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Tea vs Coffee Trends
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />

              <Line type="monotone" dataKey="tea" stroke="#16a34a" />
              <Line type="monotone" dataKey="coffee" stroke="#f97316" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Table */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            User Consumption
          </h2>

          <table className="w-full">
            <thead className="text-left text-gray-500">
              <tr>
                <th>User</th>
                <th>Tea</th>
                <th>Coffee</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u: any) => (
                <tr key={u.user} className="border-t">
                  <td className="py-3 font-medium">{u.user}</td>
                  <td>{u.tea}</td>
                  <td>{u.coffee}</td>
                  <td>
                    <span className="bg-blue-100 px-3 py-1 rounded-full">
                      {u.total}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
