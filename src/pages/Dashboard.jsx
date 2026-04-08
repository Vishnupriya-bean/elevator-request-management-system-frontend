import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ElevatorDisplay from "../components/ElevatorDisplay";
import RequestForm from "../components/RequestForm";
import QueuePanel from "../components/QueuePanel";
import HistoryTable from "../components/HistoryTable";
import "../styles/dashboard.css";

const POLL_MS = 500;

export default function Dashboard() {
  const navigate = useNavigate();
  // api base url depends on environment
  const username = localStorage.getItem("username") || "user";

  const [status, setStatus] = useState({ currentFloor: 1, isMoving: false, direction: 'idle', nextStop: null, queueCount: 0, queue: [] });
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);
  const prevStatus = useRef(status);

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

  useEffect(() => {
    const prev = prevStatus.current;
    if (prev && !prev.isMoving && status.isMoving) {
      showToast(`Moving from ${prev.currentFloor} → ${status.nextStop ?? "…"}`);
    }

    if (prev && prev.isMoving && !status.isMoving && prev.currentFloor !== status.currentFloor) {
      showToast(`Door opened at floor ${status.currentFloor}`);
    }

    prevStatus.current = status;
  }, [status]);

  // poll status every 2s
  useEffect(() => {
    const id = setInterval(() => {
      fetchStatus();
      fetchHistory();
    }, POLL_MS);
    return () => clearInterval(id);
  }, [fetchStatus, fetchHistory]);

  async function handleRequest(request) {
    try {
      await api.post("/elevator/request", request);
      const typeLabel = request.requestType === "cabin" ? "destination" : `${request.direction} call`;
      showToast(`Request added to floor ${request.floor} (${typeLabel})`);
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
            direction={status.direction}
            nextStop={status.nextStop}
            queueCount={status.queueCount}
            queue={status.queue}
          />
          <div className="dash-right-col">
            <RequestForm onRequest={handleRequest} queue={status.queue} />
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
