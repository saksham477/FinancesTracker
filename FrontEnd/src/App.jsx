import React from "react";
import Login from "./components/Login.jsx";
import NavBar from "./components/Navbar.jsx";
import Transactions from "./Pages/Transactions.jsx";
import Home from "./Pages/Home.jsx";
import Account from "./Pages/Account.jsx";
import NotFound from "./Pages/NotFound.jsx";
import UserLayout from "../layouts/UserLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
// import Dashboard from "../admin/AdminUsers.jsx";
// import AdminUsers from "../admin/AdminUsers.jsx";

import AddExpense from "./Pages/AddExpense.jsx";
import AddIncome from "./Pages/AddIncome.jsx";
import AdminLogin from "../admin/AdminLogin.jsx";
import AdminHome from "../admin/AdminHome.jsx";
import UserManagement from "../admin/UserManagement.jsx";
import TransactionManagement from "../admin/TransactionManagement.jsx";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/login-register" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/account/add-income" element={<AddIncome />} />
          <Route path="/account/add-expense" element={<AddExpense />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="transactions" element={<TransactionManagement />} />
        </Route>
        <Route path="admin-login" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
