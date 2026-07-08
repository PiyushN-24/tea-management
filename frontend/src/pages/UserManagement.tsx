import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

type User = {
  id: number;
  name: string;
  employee_code: string;
  email: string;
  location: string;
  role: string;
};

export default function UserManagement() {
  const nav = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  type UserForm = {
    name: string;
    employee_code: string;
    email: string;
    password: string;
    location: string;
    role: string;
  };

  const emptyForm: UserForm = {
    name: "",
    employee_code: "",
    email: "",
    password: "",
    location: "Giripeth",
    role: "user",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadUsers();
  }, []);

const [page, setPage] = useState(1);
const [total, setTotal] = useState(0);

async function loadUsers(currentPage = page) {
    const res = await api.get(
        `/admin/users?page=${currentPage}&limit=10`
    );

    setUsers(res.data.results);
    setTotal(res.data.total);
    setPage(res.data.page);
}

  async function save() {
    try {
      if (editingId) {
        await api.put(`/admin/users/${editingId}`, form);
        alert("User Updated Successfully");
      } else {
        await api.post("/admin/users", form);
        alert("User Created Successfully");
      }

      setForm(emptyForm);
      setEditingId(null);

      loadUsers();
    } catch (err) {
      alert("Operation failed");
    }
  }

  function editUser(user: User) {
    setEditingId(user.id);

    setForm({
      name: user.name,
      employee_code: user.employee_code,
      email: user.email,
      password: "",
      location: user.location,
      role: user.role,
    });
  }

  const filteredUsers = users.filter((u) => {
    const value = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(value) ||
      u.email.toLowerCase().includes(value) ||
      u.employee_code.toLowerCase().includes(value)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            User Management ({total})
          </h1>
          <button
            onClick={() => nav("/admin")}
            className="bg-gray-700 text-white px-5 py-2 rounded"
          >
            Back
          </button>

        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit User" : "Create User"}
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <input
              className="border rounded p-3"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="border rounded p-3"
              placeholder="Employee Code"
              value={form.employee_code}
              onChange={(e) =>
                setForm({
                  ...form,
                  employee_code: e.target.value,
                })
              }
            />

            <input
              className="border rounded p-3"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <input
              type="password"
              className="border rounded p-3"
              placeholder={
                editingId
                  ? "Leave blank to keep password"
                  : "Password"
              }
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />

            <select
              className="border rounded p-3"
              value={form.location}
              onChange={(e) =>
                setForm({
                  ...form,
                  location: e.target.value,
                })
              }
            >
              <option>Giripeth</option>
              <option>Gupta House</option>
              <option>Joshi Office</option>
              <option>Pune Office</option>
            </select>

            <select
              className="border rounded p-3"
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

          </div>

          <div className="flex gap-3 mt-6">

            <button
              onClick={save}
              className="bg-green-600 text-white px-6 py-3 rounded"
            >
              {editingId ? "Update User" : "Create User"}
            </button>

            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="bg-gray-500 text-white px-6 py-3 rounded"
              >
                Cancel
              </button>
            )}

          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between mb-4">

            <h2 className="text-xl font-semibold">
              Users
            </h2>

            <input
              placeholder="Search Name / Email / Employee Code"
              className="border rounded p-3 w-96"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Emp Code</th>
                <th className="text-left">Name</th>
                <th className="text-left">Email</th>
                <th className="text-left">Location</th>
                <th className="text-left">Role</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>

              {filteredUsers.map((u) => (

                <tr
                  key={u.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">{u.employee_code}</td>

                  <td>{u.name}</td>

                  <td>{u.email}</td>

                  <td>{u.location}</td>

                  <td>{u.role}</td>

                  <td className="text-center">

                    <button
                      onClick={() => editUser(u)}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>

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