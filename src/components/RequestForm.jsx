import { useState } from "react";

export default function RequestForm({ onRequest }) {
  const [floor, setFloor]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const f = parseInt(floor, 10);
    if (!f || f < 1 || f > 10) return;
    setLoading(true);
    await onRequest(f);
    setFloor("");
    setLoading(false);
  }

  return (
    <div className="panel request-panel">
      <h2 className="panel-title">call elevator</h2>
      <p className="panel-sub">select a floor (1–10)</p>

      <form onSubmit={handleSubmit} className="request-form">
        {/* quick floor buttons */}
        <div className="floor-grid">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((f) => (
            <button
              key={f}
              type="button"
              className={`floor-btn ${parseInt(floor) === f ? "active" : ""}`}
              onClick={() => setFloor(String(f))}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="or-divider"><span>or type</span></div>

        <input
          id="floor-input"
          type="number"
          min="1"
          max="10"
          placeholder="floor number"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          className="floor-input"
        />

        <button
          type="submit"
          className="call-btn"
          disabled={!floor || loading}
        >
          {loading ? <span className="spinner" /> : "🛗 call elevator"}
        </button>
      </form>
    </div>
  );
}
