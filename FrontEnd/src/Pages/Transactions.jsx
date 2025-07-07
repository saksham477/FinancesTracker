import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Transactions.css"; // We'll create this CSS file

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login-register");
          return;
        }

        const response = await fetch(
          "http://localhost:3000/api/transactions/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatAmount = (amount, type) => {
    return type === "income" ? `+Rs. ${amount}` : `-Rs. ${amount}`;
  };

  if (loading) return <div className="loading">Loading transactions...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="transactions-container">
      <h1>Transaction History</h1>

      <div className="summary-section">
        <div className="summary-card income-summary">
          <h3>Total Income</h3>
          <p>
            Rs.{" "}
            {transactions
              .filter((t) => t.type === "income")
              .reduce((sum, t) => sum + t.amount, 0)}
          </p>
        </div>
        <div className="summary-card expense-summary">
          <h3>Total Expenses</h3>
          <p>
            Rs.{" "}
            {transactions
              .filter((t) => t.type === "expense")
              .reduce((sum, t) => sum + t.amount, 0)}
          </p>
        </div>
        <div className="summary-card balance-summary">
          <h3>Current Balance</h3>
          <p>
            Rs.{" "}
            {transactions.reduce(
              (sum, t) =>
                t.type === "income" ? sum + t.amount : sum - t.amount,
              0
            )}
          </p>
        </div>
      </div>

      <div className="transactions-list">
        {transactions.length === 0 ? (
          <p className="no-transactions">No transactions found</p>
        ) : (
          transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((transaction) => (
              <div
                key={transaction._id}
                className={`transaction-card ${transaction.type}`}
              >
                <div className="transaction-main">
                  <div className="transaction-category">
                    {transaction.category}
                  </div>
                  <div className="transaction-amount">
                    {formatAmount(transaction.amount, transaction.type)}
                  </div>
                </div>
                <div className="transaction-details">
                  <div className="transaction-date">
                    {formatDate(transaction.date)}
                  </div>
                  {transaction.notes && (
                    <div className="transaction-notes">
                      Notes: {transaction.notes}
                    </div>
                  )}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Transactions;
