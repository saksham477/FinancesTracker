import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { autoCategory } from "../utils/categorizationRules";
import "./AddIncome.css";

export default function AddExpense() {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const navigate = useNavigate();

  // Auto-categorize when notes change
  useEffect(() => {
    if (formData.notes && !formData.category) {
      const suggestedCategory = autoCategory(formData.notes, "expense");
      if (suggestedCategory) {
        setFormData((prev) => ({ ...prev, category: suggestedCategory }));
      }
    }
  }, [formData.notes, formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If category is being manually changed, update it
    if (name === "category") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }

    // If notes are being changed, auto-suggest category
    if (name === "notes") {
      const suggestedCategory = autoCategory(value, "expense");
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        // Only auto-set category if it's currently empty or was auto-suggested
        category:
          !prev.category ||
          prev.category === autoCategory(prev.notes, "expense")
            ? suggestedCategory || prev.category
            : prev.category,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.date) {
      alert("Please fill in all required fields.");
      return;
    }

    if (formData.amount <= 0) {
      alert("Amount must be a positive value.");
      return;
    }

    if (new Date(formData.date) > new Date()) {
      alert("Date cannot be in the future.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in first!");
        navigate("/login-register");
        return;
      }

      const res = await fetch("http://localhost:3000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
          type: "expense",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Expense added successfully!");
        navigate("/");
      } else {
        alert(data.message || "Failed to add expense.");
      }
    } catch (err) {
      console.error("Error adding expense:", err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="add-income-page">
      <div className="form-container">
        <h2 className="form-title">Add Expense</h2>
        <form onSubmit={handleSubmit} className="income-form">
          <div className="form-group">
            <label>Amount (Rs.)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g., movie ticket, restaurant bill, grocery shopping"
            ></textarea>
            {formData.notes && autoCategory(formData.notes, "expense") && (
              <small className="category-suggestion">
                💡 Auto-suggested category based on your notes
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Food, Rent, Utilities"
              required
            />
            <small className="help-text">
              Category is auto-filled based on your notes, but you can edit it
            </small>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}
