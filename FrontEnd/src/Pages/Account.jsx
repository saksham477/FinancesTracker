import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Account.css";

const Account = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login-register");
          return;
        }

        const response = await fetch("http://localhost:3000/api/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        setTransactions(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigate]);

  const handleAddIncome = () => {
    navigate("/account/add-income");
  };

  const handleAddExpense = () => {
    navigate("/account/add-expense");
  };

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="account-container">
      <h2 className="account-title">Update Transactions</h2>

      <div className="summary-section">
        <div className="summary-card income">
          <p>Income</p>
          <h3>Rs. {totalIncome.toLocaleString()}</h3>
        </div>
        <div className="summary-card expense">
          <p>Expense</p>
          <h3>Rs. {totalExpense.toLocaleString()}</h3>
        </div>
      </div>

      <p className="net-balance">
        Net Balance:{" "}
        <span className={netBalance >= 0 ? "positive" : "negative"}>
          Rs. {Math.abs(netBalance).toLocaleString()}
        </span>
      </p>

      <div className="action-buttons">
        <button className="add-btn income-btn" onClick={handleAddIncome}>
          Add Income
        </button>
        <button className="add-btn expense-btn" onClick={handleAddExpense}>
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default Account;
