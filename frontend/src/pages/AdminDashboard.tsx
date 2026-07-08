import { useEffect, useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import LocationCards from "../components/LocationCards";

type Summary = {
  tea: number;
  coffee: number;
  today: number;
  week: number;
  month: number;
};

export default function AdminDashboard() {
  const nav = useNavigate();

  const [rows, setRows] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [compare, setCompare] = useState<any>(null);
  const [searchMode, setSearchMode] = useState(false);

  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [summary, setSummary] = useState<Summary>({tea: 0,coffee: 0,today: 0,week: 0,month: 0,});

  const[locationRows,setLocationRows]=useState<any[]>([]);
  const[period,setPeriod]=useState("today");

  useEffect(() => {loadDashboard();}, [period]);
 
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  async function loadDashboard() {
    const consumption = await api.get("/admin/consumption");
    setRows(consumption.data);

    const analytics = await api.get("/admin/analytics");
    setSummary(analytics.data.summary);

   const locations = await api.get("/admin/location-summary", {params: { period },});
   setLocationRows(locations.data);
  }

  async function search(currentPage = 1) {
    const params: any = {
      page: currentPage,
      limit,
    };

    if (query.trim()) params.search = query;
    if (location) params.location = location;
    if (fromDate) {
      params.date_from = fromDate;
    }

    if (toDate) {
      params.date_to = toDate;
    }

    const res = await api.get("/admin/analytics", {params,});

    setHistory(res.data.results || []);
    setSummary(res.data.summary);
    setCompare(res.data.compare);

    setTotalPages(Math.max(1,Math.ceil((res.data.total || 0) / limit)));

    setPage(currentPage);
    setSearchMode(true);
  }

  function resetSearch() {
    setQuery("");
    setLocation("");
    setFromDate("");
    setToDate("");
    setHistory([]);
    setCompare(null);
    setSearchMode(false);
    setPage(1);
    loadDashboard();
  }

async function exportCSV() {
  const params: any = {};

  if (query.trim()) params.search = query;
  if (location) params.location = location;

  if (fromDate) {
    params.date_from = fromDate;
  }

  if (toDate) {
    params.date_to = toDate;
  }

  const response = await api.get("/admin/export", {
    params,
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(response.data);

  const link = document.createElement("a");

  link.href = url;
  link.download = "tea-report.csv";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}

return (
  <div className="min-h-screen bg-slate-100 dark:bg-slate-900 dark:text-white">
    {/* Header */}
    <header className="bg-white dark:bg-slate-800 shadow flex justify-between items-center px-8 py-5">
      <div>
        <h1 className="text-3xl font-bold">☕ Tea Management</h1>
        <p className="text-gray-500 dark:text-gray-300">Admin Dashboard</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-lg border px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>

        <button
          onClick={() => nav("/admin/users")}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
        >
          User Management
        </button>

        <button
          onClick={() => {
            localStorage.clear();
            nav("/");
          }}
          className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </header>

    {/* Cards */}
    <div className="grid grid-cols-1 md:grid-cols-5 gap-5 p-8">
      <StatsCard title="Tea" value={summary.tea} />
      <StatsCard title="Coffee" value={summary.coffee} />
      <StatsCard title="Today" value={summary.today} />
      <StatsCard title="Week" value={summary.week} />
      <StatsCard title="Month" value={summary.month} />
    </div>

    {/* Location Summary Toggle */}
    <div className="px-8 mb-4">
      <div className="flex gap-3">
        <button
          onClick={() => setPeriod("today")}
          className={
            period === "today"
              ? "bg-green-600 text-white px-4 py-2 rounded-lg"
              : "border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-lg"
          }
        >
          Today
        </button>

        <button
          onClick={() => setPeriod("month")}
          className={
            period === "month"
              ? "bg-green-600 text-white px-4 py-2 rounded-lg"
              : "border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-lg"
          }
        >
          Monthly
        </button>
      </div>
    </div>

    {/* Location Summary Cards */}
    <div className="px-8 mb-8">
      <LocationCards rows={locationRows} />
    </div>

    {/* Search */}
    <div className="px-8">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            className="border rounded-lg p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="Name / Employee Code"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            className="border rounded-lg p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            <option>Giripeth</option>
            <option>Gupta House</option>
            <option>Joshi Office</option>
            <option>Pune Office</option>
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              className="border rounded-lg p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input
              type="date"
              className="border rounded-lg p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <button
            onClick={() => search(1)}
            className="bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Search
          </button>

          <button
            onClick={resetSearch}
            className="bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Reset
          </button>
        </div>

        <button
          onClick={exportCSV}
          className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Export CSV
        </button>
      </div>
    </div>

    <div className="p-8 space-y-8">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
        <div className="p-5 text-xl font-semibold border-b border-gray-200 dark:border-slate-700">
          Today's User Consumption
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-[520px] rounded-lg border border-gray-200 dark:border-slate-700">
          <table className="min-w-full table-fixed border-collapse">
            <thead className="bg-gray-100 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left text-slate-900 dark:text-white">
                  User
                </th>
                <th className="px-4 py-3 text-left text-slate-900 dark:text-white">
                  Location
                </th>
                <th className="px-4 py-3 text-center text-slate-900 dark:text-white">
                  Tea
                </th>
                <th className="px-4 py-3 text-center text-slate-900 dark:text-white">
                  Coffee
                </th>
                <th className="px-4 py-3 text-center text-slate-900 dark:text-white">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>

                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, index) => (
                    <tr
                      key={`${r.user}-${r.location}-${r.tea}-${r.coffee}-${index}`}
                      className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-900"
                    >
                      <td className="px-4 py-3 text-slate-900 dark:text-white">
                        {r.user}
                      </td>
                      <td className="px-4 py-3 text-slate-900 dark:text-white">
                        {r.location}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-900 dark:text-white">
                        {r.tea}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-900 dark:text-white">
                        {r.coffee}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-white">
                        {r.total}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      {/* Search Results */}
      {searchMode && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-5">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Search Results
          </h2>

          {compare && (
            <div className="mb-4 text-slate-900 dark:text-white">
              Today: <b>{compare.today}</b> | Selected Date:{" "}
              <b>{compare.selected_day}</b>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100 dark:bg-slate-900 border-b border-gray-300 dark:border-slate-700">
                <tr>
                  <th className="w-[18%] px-4 py-3 text-left font-semibold">User</th>
                  {/*
                  <th className="w-[12%] px-4 py-3 text-center font-semibold">
                    Emp Code
                  </th>
                  <th className="w-[22%] px-4 py-3 text-left font-semibold">
                    Email
                  </th>
                  */}
                  <th className="w-[15%] px-4 py-3 text-center font-semibold">
                    Location
                  </th>
                  <th className="w-[10%] px-4 py-3 text-center font-semibold">
                    Drink
                  </th>
                  <th className="w-[8%] px-4 py-3 text-center font-semibold">
                    Qty
                  </th>
                  <th className="w-[15%] px-4 py-3 text-center font-semibold">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  history.map((r, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-900"
                    >
                      <td className="px-4 py-3 truncate">
                        {r.name}
                      </td>
                      {/*
                      <td className="px-4 py-3 text-center">
                        {r.employee_code}
                      </td>
                      <td
                        className="px-4 py-3 truncate"
                        title={r.email}
                      >
                        {r.email}
                      </td>
                      */}
                      <td className="px-4 py-3 text-center">
                        {r.location}
                      </td>
                      <td className="px-4 py-3 text-center capitalize">
                        {r.beverage}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">
                        {r.quantity}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {new Date(r.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              disabled={page === 1}
              onClick={() => search(page - 1)}
              className="rounded-lg border px-4 py-2 disabled:opacity-50"
            >
              ← Previous
            </button>

            <span className="font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => search(page + 1)}
              className="rounded-lg border px-4 py-2 disabled:opacity-50"
            >
              Next →
            </button>

          </div>
        </div>
      )}
    </div>
  </div>
);

}

function StatsCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 text-center">
      <div className="text-gray-500 dark:text-gray-300">
        {title}
      </div>

      <div className="text-4xl font-bold mt-3 text-slate-900 dark:text-white">
        {value}
      </div>
    </div>
  );
}