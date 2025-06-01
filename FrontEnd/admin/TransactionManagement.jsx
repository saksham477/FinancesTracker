import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TransactionManagement.css";

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const url =
          filter === "all"
            ? "http://localhost:3000/api/transactions"
            : `http://localhost:3000/api/transactions?type=${filter}`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Ensure response.data is an array
        if (!Array.isArray(response.data)) {
          throw new Error("Invalid data format: expected array");
        }

        setTransactions(response.data);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load transactions"
        );
        setTransactions([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [filter]);

  const handleDelete = async (transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3000/api/transactions/${transactionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransactions(transactions.filter((t) => t._id !== transactionId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete transaction");
    }
  };

  if (loading) return <div className="loading">Loading transactions...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="transaction-management">
      <h2>Transaction Management</h2>

      <div className="filters">
        <label>
          Filter:
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
        </label>
      </div>

      {transactions.length === 0 ? (
        <div className="no-transactions">No transactions found</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Type</th>
              <th>Category</th>
              <th>Date</th>
              <th>User</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>${transaction.amount?.toFixed(2)}</td>
                <td className={`type-${transaction.type}`}>
                  {transaction.type}
                </td>
                <td>{transaction.category}</td>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.userId?.name || transaction.userId}</td>
                <td>
                  <button
                    onClick={() => handleDelete(transaction._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionManagement;
