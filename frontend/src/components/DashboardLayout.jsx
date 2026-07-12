import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const username = user?.email
    ? user.email
        .split("@")[0]
        .split(".")[0]
        .replace(/^\w/, (c) => c.toUpperCase())
    : "Sahil M.";
  const userRole = user?.role || "Dispatcher";
  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/home",
      icon: (
        <svg
          className="to-sidebar-link-icon"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      ),
    },
    {
      name: "Fleet",
      path: "/fleet",
      icon: (
        <svg
          className="to-sidebar-link-icon"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="17" cy="18" r="2" />
          <path d="M7 6v-2h10v2" />
        </svg>
      ),
    },
    {
      name: "Drivers",
      path: "/drivers",
      icon: (
        <svg
          className="to-sidebar-link-icon"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      name: "Trips",
      path: "/trips",
      icon: (
        <svg
          className="to-sidebar-link-icon"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2a10 10 0 0 0-10 10c0 4.42 8.75 11.23 9.41 11.72a1 1 0 0 0 1.18 0c.66-.49 9.41-7.3 9.41-11.72a10 10 0 0 0-10-10z" />
        </svg>
      ),
    },
    {
      name: "Maintenance",
      path: "/maintenance",
      icon: (
        <svg
          className="to-sidebar-link-icon"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
    },
    {
      name: "Fuel & Expenses",
      path: "/fuel",
      icon: (
        <svg
          className="to-sidebar-link-icon"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: (
        <svg
          className="to-sidebar-link-icon"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      name: "Settings",
      path: "/settings",
      icon: (
        <svg
          className="to-sidebar-link-icon"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="to-layout">
      {isMobileOpen && (
        <div
          className="to-sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`to-sidebar ${isCollapsed ? "collapsed" : ""} ${isMobileOpen ? "mobile-open" : ""}`}
      >
        <div className="to-sidebar-logo">
          <svg
            className="to-sidebar-logo-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M13 8h4l3 3v5"
            />
          </svg>
          {!isCollapsed && (
            <span className="to-sidebar-logo-text">TransitOps</span>
          )}

          <button
            className="to-sidebar-mobile-close"
            onClick={() => setIsMobileOpen(false)}
          >
            &times;
          </button>
        </div>

        <nav className="to-sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `to-sidebar-link ${isActive ? "active" : ""}`
              }
              title={isCollapsed ? item.name : undefined}
              onClick={() => setIsMobileOpen(false)}
            >
              {item.icon}
              {!isCollapsed && (
                <span className="to-sidebar-link-text">{item.name}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="to-sidebar-footer">
          <span>{isCollapsed ? "v1" : "v1.0.0"}</span>
          {!isCollapsed && <span className="mono"></span>}
        </div>
      </aside>

      <div className="to-layout-main">
        <header className="to-header">
          <div
            style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}
          >
            <button
              className="to-header-mobile-toggle"
              onClick={() => setIsMobileOpen(true)}
            >
              <svg
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <button
              className="to-header-collapse-toggle"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                {isCollapsed ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 19l-7-7 7-7M19 19l-7-7 7-7"
                  />
                )}
              </svg>
            </button>

            <div className="to-header-search-wrap">
              <svg
                className="to-header-search-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                className="to-header-search"
                placeholder="Search..."
              />
            </div>
          </div>

          <div className="to-header-profile">
            <span className="to-header-user-name">{username}</span>
            <span className="to-header-role-badge">{userRole}</span>
            <div className="to-header-avatar">{initials}</div>
          </div>
        </header>
        <main className="to-viewport">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
