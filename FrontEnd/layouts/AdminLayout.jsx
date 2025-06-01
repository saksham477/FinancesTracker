import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get current user from localStorage
  const user = JSON.parse(
    localStorage.getItem("user") || '{"name":"Admin User"}'
  );

  useEffect(() => {
    // Check authentication and admin status when component mounts
    const checkAuth = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!token || !user || user.role !== "admin") {
        localStorage.clear();
        navigate("/admin-login");
      }
    };

    checkAuth();

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  // Get current page name from path
  const getCurrentPageName = () => {
    const path = location.pathname.split("/").pop();
    if (!path || path === "admin-dashboard") return "Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div
      className={`admin-layout ${
        isSidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      <header className="admin-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h1>Admin Portal</h1>
        </div>

        <div className="header-right">
          <div className="header-time">
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="user-profile">
            <div className="avatar">{user.name.charAt(0)}</div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <nav className={`admin-sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">AP</div>
          {!isSidebarCollapsed && <span>Admin Portal</span>}
        </div>

        <ul className="sidebar-menu">
          <li
            className={location.pathname === "/admin-dashboard" ? "active" : ""}
          >
            <button onClick={() => navigate("/admin-dashboard")}>
              <svg className="menu-icon" viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
              </svg>
              {!isSidebarCollapsed && <span>Dashboard</span>}
            </button>
          </li>
          <li className={location.pathname.includes("/users") ? "active" : ""}>
            <button onClick={() => navigate("/admin-dashboard/users")}>
              <svg className="menu-icon" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              {!isSidebarCollapsed && <span>Users</span>}
            </button>
          </li>
          <li
            className={
              location.pathname.includes("/transactions") ? "active" : ""
            }
          >
            <button onClick={() => navigate("/admin-dashboard/transactions")}>
              <svg className="menu-icon" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              {!isSidebarCollapsed && <span>Transactions</span>}
            </button>
          </li>
          <li
            className={location.pathname.includes("/reports") ? "active" : ""}
          >
            <button onClick={() => navigate("/admin-dashboard/reports")}>
              <svg className="menu-icon" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
              </svg>
              {!isSidebarCollapsed && <span>Reports</span>}
            </button>
          </li>
          <li
            className={location.pathname.includes("/settings") ? "active" : ""}
          >
            <button onClick={() => navigate("/admin-dashboard/settings")}>
              <svg className="menu-icon" viewBox="0 0 24 24">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </svg>
              {!isSidebarCollapsed && <span>Settings</span>}
            </button>
          </li>
        </ul>
      </nav>

      <main className="admin-content">
        <div className="content-header">
          <div className="breadcrumb">
            <span>Home</span>
            <span className="separator">/</span>
            <span className="current">{getCurrentPageName()}</span>
          </div>
        </div>
        <div className="content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
