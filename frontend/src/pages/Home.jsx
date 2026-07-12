import { useEffect, useState } from "react";
import apiCall from "../api";
import { MasterAPI } from "../Api.jsx";
import { METHOD } from "../commons/CommonEnum";
import PageToolbar from "../components/PageToolbar";
import "./Home.css";

const Home = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const result = await apiCall(MasterAPI?.Dashboard, METHOD?.Get);
        if (isMounted) {
          setDashboardData(result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="to-dashboard-loading">Loading Dashboard...</div>;
  }

  if (!dashboardData) {
    return <div className="to-dashboard-error">Failed to load dashboard data.</div>;
  }

  const { vehicles, drivers, trips, fleet_health, alerts } = dashboardData;

  return (
    <div className="to-dashboard-container">
      <PageToolbar title="Operations Dashboard" />

      <div className="to-dashboard-grid">
        <div className="to-dashboard-card premium-card">
          <div className="to-dashboard-card-header">
            <h3>Fleet Health</h3>
            <span
              className={`health-badge ${
                fleet_health >= 90
                  ? "excellent"
                  : fleet_health >= 75
                  ? "good"
                  : "warning"
              }`}
            >
              {fleet_health}%
            </span>
          </div>
          <div className="to-dashboard-progress-wrap">
            <div
              className="to-dashboard-progress-bar"
              style={{ width: `${fleet_health}%` }}
            ></div>
          </div>
        </div>

        <div className="to-dashboard-card">
          <h3>Vehicles</h3>
          <div className="to-dashboard-stats">
            <div className="to-dashboard-stat-item">
              <span className="stat-label">Total</span>
              <span className="stat-value">{vehicles?.total || 0}</span>
            </div>
            <div className="to-dashboard-stat-item">
              <span className="stat-label">Available</span>
              <span className="stat-value text-green">
                {vehicles?.available || 0}
              </span>
            </div>
            <div className="to-dashboard-stat-item">
              <span className="stat-label">On Trip</span>
              <span className="stat-value text-blue">
                {vehicles?.on_trip || 0}
              </span>
            </div>
            <div className="to-dashboard-stat-item">
              <span className="stat-label">In Shop</span>
              <span className="stat-value text-orange">
                {vehicles?.in_shop || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="to-dashboard-card">
          <h3>Drivers</h3>
          <div className="to-dashboard-stats">
            <div className="to-dashboard-stat-item">
              <span className="stat-label">Total</span>
              <span className="stat-value">{drivers?.total || 0}</span>
            </div>
            <div className="to-dashboard-stat-item">
              <span className="stat-label">Available</span>
              <span className="stat-value text-green">
                {drivers?.available || 0}
              </span>
            </div>
            <div className="to-dashboard-stat-item">
              <span className="stat-label">On Trip</span>
              <span className="stat-value text-blue">
                {drivers?.on_trip || 0}
              </span>
            </div>
            <div className="to-dashboard-stat-item">
              <span className="stat-label">Suspended</span>
              <span className="stat-value text-red">
                {drivers?.suspended || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="to-dashboard-card">
          <h3>Trips</h3>
          <div className="to-dashboard-stats">
            <div className="to-dashboard-stat-item">
              <span className="stat-label">Total</span>
              <span className="stat-value">{trips?.total || 0}</span>
            </div>
            <div className="to-dashboard-stat-item">
              <span className="stat-label">Active</span>
              <span className="stat-value text-blue">{trips?.active || 0}</span>
            </div>
            <div className="to-dashboard-stat-item">
              <span className="stat-label">Completed</span>
              <span className="stat-value text-green">
                {trips?.completed || 0}
              </span>
            </div>
            <div className="to-dashboard-stat-item">
              <span className="stat-label">Cancelled</span>
              <span className="stat-value text-red">
                {trips?.cancelled || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="to-dashboard-alerts">
        <h3>System Alerts</h3>
        {alerts && alerts.length > 0 ? (
          <div className="to-dashboard-alerts-list">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`to-dashboard-alert-item ${
                  alert.severity?.toLowerCase() || "info"
                }`}
              >
                {alert.message || JSON.stringify(alert)}
              </div>
            ))}
          </div>
        ) : (
          <div className="to-dashboard-alerts-empty">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            No active alerts. All systems operational.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
