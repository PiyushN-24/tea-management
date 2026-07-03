import { useEffect, useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";

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
  const [day, setDay] = useState("");
  const [compare, setCompare] = useState<any>(null);
  const [searchMode, setSearchMode] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [summary, setSummary] = useState<Summary>({
    tea: 0,
    coffee: 0,
    today: 0,
    week: 0,
    month: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const consumption = await api.get("/admin/consumption");
    setRows(consumption.data);

    const analytics = await api.get("/admin/analytics");
    setSummary(analytics.data.summary);
  }

  async function search(currentPage = 1) {
    const params: any = {
      page: currentPage,
      limit,
    };

    if (query.trim()) params.search = query;
    if (location) params.location = location;
    if (day) {
      params.date_from = day;
      params.date_to = day;
      params.compare_date = day;
    }

    const res = await api.get("/admin/analytics", {
      params,
    });

    setHistory(res.data.results || []);
    setSummary(res.data.summary);
    setCompare(res.data.compare);

    setTotalPages(
      Math.max(
        1,
        Math.ceil((res.data.total || 0) / limit)
      )
    );

    setPage(currentPage);
    setSearchMode(true);
  }

  function resetSearch() {
    setQuery("");
    setLocation("");
    setDay("");
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

  if (day) {
    params.date_from = day;
    params.date_to = day;
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
    <div className="min-h-screen bg-slate-100">

      {/* Header */}

      <header className="bg-white shadow flex justify-between items-center px-10 py-5">

        <div>

          <h1 className="text-3xl font-bold">
            ☕ Tea Management
          </h1>

          <p className="text-gray-500">
            Admin Dashboard
          </p>

        </div>

        <div className="space-x-3">

          <button
            onClick={() => nav("/admin/users")}
            className="bg-green-600 text-white px-5 py-2 rounded-lg"
          >
            Create User
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              nav("/");
            }}
            className="bg-red-500 text-white px-5 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

      </header>

      {/* Cards */}

      <div className="grid grid-cols-5 gap-5 p-8">

        <StatsCard title="Tea" value={summary.tea} />
        <StatsCard title="Coffee" value={summary.coffee} />
        <StatsCard title="Today" value={summary.today} />
        <StatsCard title="Week" value={summary.week} />
        <StatsCard title="Month" value={summary.month} />

      </div>

      {/* Search */}

      <div className="px-8">

        <div className="bg-white rounded-xl shadow p-5">

          <div className="grid grid-cols-5 gap-3">

            <input
              className="border rounded p-3"
              placeholder="Name / Employee Code"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <select
              className="border rounded p-3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              <option>Giripeth</option>
              <option>Gupta House</option>
              <option>Joshi Office</option>
              <option>Pune Office</option>
            </select>

            <input
              type="date"
              className="border rounded p-3"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />

            <button
              onClick={() => search(1)}
              className="bg-green-600 text-white rounded"
            >
              Search
            </button>

            <button
              onClick={resetSearch}
              className="bg-gray-600 text-white rounded"
            >
              Reset
            </button>

          </div>

          <button
            onClick={exportCSV}
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded"
          >
            Export CSV
          </button>

        </div>

      </div>

      {/* Dashboard OR Search */}

      <div className="p-8">

        {!searchMode ? (

          <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="p-5 text-xl font-semibold">
              Today's User Consumption
            </div>

            <table className="w-full">

              <thead className="bg-slate-100">

                <tr>
                  <th>User</th>
                  <th>Tea</th>
                  <th>Coffee</th>
                  <th>Total</th>
                </tr>

              </thead>

              <tbody>

                {rows.map((r) => (

                  <tr key={r.user} className="border-t">

                    <td className="p-3">{r.user}</td>
                    <td>{r.tea}</td>
                    <td>{r.coffee}</td>
                    <td>{r.total}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="bg-white rounded-xl shadow p-5">

            <h2 className="text-xl font-semibold mb-4">
              Search Results
            </h2>

            {compare && (
              <div className="mb-5 text-sm text-gray-700">
                Today: <b>{compare.today}</b> &nbsp; | &nbsp;
                Selected Date: <b>{compare.selected_day}</b>
              </div>
            )}

            <table className="w-full">

              <thead className="bg-slate-100">

                <tr>
                  <th>User</th>
                  <th>Emp Code</th>
                  <th>Email</th>
                  <th>Drink</th>
                  <th>Qty</th>
                  <th>Date</th>
                </tr>

              </thead>

              <tbody>

                {history.map((r, i) => (

                  <tr key={i} className="border-t">

                    <td>{r.name}</td>
                    <td>{r.employee_code}</td>
                    <td>{r.email}</td>
                    <td>{r.beverage}</td>
                    <td>{r.quantity}</td>
                    <td>{r.date}</td>

                  </tr>

                ))}

              </tbody>

            </table>

            <div className="flex justify-center items-center gap-4 mt-6">

              <button
                disabled={page === 1}
                onClick={() => search(page - 1)}
                className="border px-4 py-2 rounded"
              >
                Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => search(page + 1)}
                className="border px-4 py-2 rounded"
              >
                Next
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
    <div className="bg-white rounded-xl shadow p-6 text-center">

      <div className="text-gray-500">{title}</div>

      <div className="text-4xl font-bold mt-3">
        {value}
      </div>

    </div>
  );
}
