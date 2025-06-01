import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminHome.css";

const AdminHome = () => {
  const [stats, setStats] = useState({
    users: 0,
    transactions: 0,
    income: 0,
    expenses: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/api/admin/stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Make sure we're accessing the data correctly
        const { data } = response.data; // response.data.data contains our stats

        setStats({
          users: data.users || 0,
          transactions: data.transactions || 0,
          income: data.income || 0,
          expenses: data.expenses || 0,
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard data. Please try again."
        );
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-home">
      <h2>Dashboard Overview</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.users.toLocaleString()}</p>
        </div>

        <div className="stat-card">
          <h3>Total Transactions</h3>
          <p>{stats.transactions.toLocaleString()}</p>
        </div>

        <div className="stat-card">
          <h3>Total Income</h3>
          <p>
            NRS :
            {stats.income.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="stat-card">
          <h3>Total Expenses</h3>
          <p>
            NRS :
            {stats.expenses.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
