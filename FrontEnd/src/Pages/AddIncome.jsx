import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddIncome.css";

export default function AddIncome() {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.date) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in first!");
        navigate("/login-register");
        return;
      }

      const res = await fetch("http://localhost:3000/api/transactions/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
          type: "income",
        }),
      });

      const data = await res.json();
      if (formData.amount <= 0) {
        alert("Amount must be a positive value.");
        return;
      }

      if (new Date(formData.date) > new Date()) {
        alert("Date cannot be in the future.");
        return;
      }

      if (res.ok) {
        alert("Income added successfully!");
        navigate("/");
      } else {
        alert(data.message || "Failed to add income.");
      }
    } catch (err) {
      console.error("Error adding income:", err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="add-income-page">
      <div className="form-container">
        <h2 className="form-title">Add Income</h2>
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
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Salary, Freelance"
              required
            />
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

          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            Add Income
          </button>
        </form>
      </div>
    </div>
  );
}
