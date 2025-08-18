import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TransactionManagement.css";

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  // Generate month options for the current year and previous year
  const generateMonthOptions = () => {
    const currentYear = new Date().getFullYear();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const options = [{ value: "all", label: "All Months" }];

    // Add current year and previous year months
    [currentYear, currentYear - 1].forEach((year) => {
      months.forEach((month, index) => {
        const value = `${year}-${String(index + 1).padStart(2, "0")}`;
        const label = `${month} ${year}`;
        options.push({ value, label });
      });
    });

    return options;
  };

  const monthOptions = generateMonthOptions();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        // For now, fetch all transactions and filter client-side
        // You can modify this later when your backend supports month filtering
        const url =
          filter === "all"
            ? "http://localhost:3000/api/transactions"
            : `http://localhost:3000/api/transactions?type=${filter}`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!Array.isArray(response.data.data)) {
          throw new Error("Invalid data format: expected array");
        }

        let filteredTransactions = response.data.data;

        // Client-side month filtering
        if (selectedMonth !== "all") {
          const [selectedYear, selectedMonthNum] = selectedMonth.split("-");
          filteredTransactions = response.data.data.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            const transactionYear = transactionDate.getFullYear().toString();
            const transactionMonth = (transactionDate.getMonth() + 1)
              .toString()
              .padStart(2, "0");

            return (
              transactionYear === selectedYear &&
              transactionMonth === selectedMonthNum
            );
          });
        }

        setTransactions(filteredTransactions);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load transactions"
        );
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [filter, selectedMonth]);

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

  const resetFilters = () => {
    setFilter("all");
    setSelectedMonth("all");
  };

  if (loading) return <div className="loading">Loading transactions...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="transaction-management">
      <h2>Transaction Management</h2>

      <div className="filters">
        <div className="filter-group">
          <label>
            Filter by Type:
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </label>
        </div>

        <div className="filter-group">
          <label>
            Filter by Month:
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="filter-actions">
          <button onClick={resetFilters} className="reset-btn">
            Reset Filters
          </button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="no-transactions">
          No transactions found
          {(filter !== "all" || selectedMonth !== "all") && (
            <span> for the selected filters</span>
          )}
        </div>
      ) : (
        <>
          <div className="transaction-summary">
            Showing {transactions.length} transaction
            {transactions.length !== 1 ? "s" : ""}
            {selectedMonth !== "all" && (
              <span>
                {" "}
                for{" "}
                {monthOptions.find((opt) => opt.value === selectedMonth)?.label}
              </span>
            )}
          </div>

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
                  <td>NRs{transaction.amount?.toFixed(2)}</td>
                  <td className={`type-${transaction.type}`}>
                    {transaction.type}
                  </td>
                  <td>{transaction.category}</td>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.userId?.name}</td>
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
        </>
      )}
    </div>
  );
};

export default TransactionManagement;
