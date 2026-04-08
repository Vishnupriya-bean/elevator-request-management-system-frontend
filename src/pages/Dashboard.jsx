import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ElevatorDisplay from "../components/ElevatorDisplay";
import RequestForm     from "../components/RequestForm";
import QueuePanel      from "../components/QueuePanel";
import HistoryTable    from "../components/HistoryTable";
import "../styles/dashboard.css";

const POLL_MS = 2000;

export default function Dashboard() {
  const navigate  = useNavigate();
  const username  = localStorage.getItem("username") || "user";

  const [status, setStatus]   = useState({ currentFloor: 1, isMoving: false, queue: [] });
  const [history, setHistory] = useState([]);
  const [toast, setToast]     = useState("");

  const fetchStatus = useCallback(async () => {
    try {
      const { data } = await api.get("/elevator/status");
      setStatus(data);
    } catch {
      // silently ignore poll errors
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const { data } = await api.get("/elevator/history");
      setHistory(data);
    } catch {
      // silently ignore
    }
  }, []);

  // initial load
  useEffect(() => {
    fetchStatus();
    fetchHistory();
  }, [fetchStatus, fetchHistory]);

  // poll status every 2s
  useEffect(() => {
    const id = setInterval(() => {
      fetchStatus();
      fetchHistory();
    }, POLL_MS);
    return () => clearInterval(id);
  }, [fetchStatus, fetchHistory]);

  async function handleRequest(floor) {
    try {
      await api.post("/elevator/request", { floor });
      showToast(`elevator requested to floor ${floor}`);
      fetchStatus();
    } catch (err) {
      showToast(err.response?.data?.error || "request failed", true);
    }
  }

  function showToast(msg, isError = false) {
    setToast({ msg, isError });
    setTimeout(() => setToast(""), 3000);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  }

  return (
    <div className="dash-bg">
      {/* navbar */}
      <nav className="dash-nav">
        <div className="nav-brand">
          <span className="nav-icon">🛗</span>
          <span className="nav-title">ElevatorOS</span>
        </div>
        <div className="nav-right">
          <span className="nav-user">👤 {username}</span>
          <button className="nav-logout" onClick={logout}>Logout</button>
        </div>
      </nav>

      <main className="dash-main">
        {/* top row */}
        <div className="dash-top">
          <ElevatorDisplay
            currentFloor={status.currentFloor}
            isMoving={status.isMoving}
            queue={status.queue}
          />
          <div className="dash-right-col">
            <RequestForm onRequest={handleRequest} />
            <QueuePanel queue={status.queue} />
          </div>
        </div>

        {/* history */}
        <HistoryTable history={history} />
      </main>

      {/* toast */}
      {toast && (
        <div className={`toast ${toast.isError ? "toast-error" : "toast-success"}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
