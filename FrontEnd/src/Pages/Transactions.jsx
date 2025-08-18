import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Transactions.css"; // We'll create this CSS file

const Transactions = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

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
        setAllTransactions(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigate]);

  // Filter transactions based on selected filters
  useEffect(() => {
    let filtered = [...allTransactions];

    // Filter by type
    if (filter !== "all") {
      filtered = filtered.filter((transaction) => transaction.type === filter);
    }

    // Filter by month
    if (selectedMonth !== "all") {
      const [selectedYear, selectedMonthNum] = selectedMonth.split("-");
      filtered = filtered.filter((transaction) => {
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

    setFilteredTransactions(filtered);
  }, [allTransactions, filter, selectedMonth]);

  const resetFilters = () => {
    setFilter("all");
    setSelectedMonth("all");
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatAmount = (amount, type) => {
    return type === "income" ? `+Rs. ${amount}` : `-Rs. ${amount}`;
  };

  // Calculate summaries based on filtered transactions
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = filteredTransactions.reduce(
    (sum, t) => (t.type === "income" ? sum + t.amount : sum - t.amount),
    0
  );

  if (loading) return <div className="loading">Loading transactions...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="transactions-container">
      <h1>Transaction History</h1>

      {/* Filter Controls */}
      <div className="filters-section">
        <div className="filters">
          <div className="filter-group">
            <label>
              Filter by Type:
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
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

        {/* Show active filters */}
        {(filter !== "all" || selectedMonth !== "all") && (
          <div className="active-filters">
            <span className="filter-label">Active filters:</span>
            {filter !== "all" && <span className="filter-tag">{filter}</span>}
            {selectedMonth !== "all" && (
              <span className="filter-tag">
                {monthOptions.find((opt) => opt.value === selectedMonth)?.label}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="summary-section">
        <div className="summary-card income-summary">
          <h3>Total Income</h3>
          <p>Rs. {totalIncome}</p>
        </div>
        <div className="summary-card expense-summary">
          <h3>Total Expenses</h3>
          <p>Rs. {totalExpenses}</p>
        </div>
        <div className="summary-card balance-summary">
          <h3>Current Balance</h3>
          <p>Rs. {currentBalance}</p>
        </div>
      </div>

      <div className="transactions-list">
        {filteredTransactions.length === 0 ? (
          <div className="no-transactions">
            <p>No transactions found</p>
            {(filter !== "all" || selectedMonth !== "all") && (
              <p className="filter-hint">
                Try adjusting your filters or reset them to see all transactions
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="transaction-count">
              Showing {filteredTransactions.length} of {allTransactions.length}{" "}
              transactions
            </div>
            {filteredTransactions
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
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Transactions;
