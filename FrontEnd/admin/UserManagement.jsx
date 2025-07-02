"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success || !Array.isArray(response.data.data)) {
        throw new Error("Invalid data format received from server");
      }

      setUsers(response.data.data);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load users"
      );
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((user) => user._id !== userId));
      setSuccessMessage("User deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role || "user",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3000/api/users/${userId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, ...editForm } : user
        )
      );
      setEditingUser(null);
      setSuccessMessage("User updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/users",
        addForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers([...users, response.data.data]);
      setShowAddForm(false);
      setAddForm({
        name: "",
        email: "",
        password: "",
        role: "user",
      });
      setSuccessMessage("User added successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add user");
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <div className="add-user-section">
        <button onClick={toggleAddForm} className="add-btn">
          {showAddForm ? "Cancel" : "Add New User"}
        </button>

        {showAddForm && (
          <form onSubmit={handleAddUser} className="add-user-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={addForm.name}
                onChange={handleAddFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={addForm.email}
                onChange={handleAddFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={addForm.password}
                onChange={handleAddFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                name="role"
                value={addForm.role}
                onChange={handleAddFormChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="submit-btn">
              Add User
            </button>
          </form>
        )}
      </div>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {users.length === 0 ? (
        <div className="no-users">No users found</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Joined Date</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  {editingUser === user._id ? (
                    <input
                      className="editForm"
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingUser === user._id ? (
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  {editingUser === user._id ? (
                    <select
                      name="role"
                      value={editForm.role}
                      onChange={handleEditChange}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    user.role || "user"
                  )}
                </td>
                <td>
                  {editingUser === user._id ? (
                    <>
                      <button
                        onClick={() => handleEditSubmit(user._id)}
                        className="save-btn"
                      >
                        Save
                      </button>
                      <button onClick={handleCancelEdit} className="cancel-btn">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(user)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
