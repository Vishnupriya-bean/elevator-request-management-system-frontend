import { useState } from "react";

export default function RequestForm({ onRequest, queue }) {
  const [floor, setFloor] = useState("");
  const [requestType, setRequestType] = useState("cabin");
  const [direction, setDirection] = useState("up");
  const [loading, setLoading] = useState(false);

  const requestedFloors = new Set(queue.map((r) => r.floor));
  const selectedFloor = parseInt(floor, 10);
  const isDuplicate = !isNaN(selectedFloor) && selectedFloor > 0 && requestedFloors.has(selectedFloor);

  async function handleSubmit(e) {
    e.preventDefault();
    const f = parseInt(floor, 10);
    if (!f || f < 1 || f > 10 || isDuplicate) return;
    setLoading(true);
    await onRequest({ floor: f, requestType, direction });
    setFloor("");
    setLoading(false);
  }

  return (
    <div className="panel request-panel">
      <h2 className="panel-title">call elevator</h2>
      <p className="panel-sub">select a floor (1–10)</p>

      <form onSubmit={handleSubmit} className="request-form">
        {/* request type selector: cabin vs hall call */}
        <div className="request-type-selector">
          <label>
            <input
              type="radio"
              value="cabin"
              checked={requestType === "cabin"}
              onChange={(e) => setRequestType(e.target.value)}
            />
            Inside Elevator (Destination)
          </label>
          <label>
            <input
              type="radio"
              value="hall"
              checked={requestType === "hall"}
              onChange={(e) => setRequestType(e.target.value)}
            />
            Outside Elevator (Hall Call)
          </label>
        </div>

        {/* direction selector for hall calls only */}
        {requestType === "hall" && (
          <div className="direction-selector">
            <button
              type="button"
              className={`direction-btn ${direction === "up" ? "active" : ""}`}
              onClick={() => setDirection("up")}
            >
              ▲ Going UP
            </button>
            <button
              type="button"
              className={`direction-btn ${direction === "down" ? "active" : ""}`}
              onClick={() => setDirection("down")}
            >
              ▼ Going DOWN
            </button>
          </div>
        )}

        {/* quick select floor buttons */}
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

        <div className="or-divider"><span>or type manually</span></div>

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
          disabled={!floor || loading || isDuplicate}
        >
          {loading ? <span className="spinner" /> : "🛗 call elevator"}
        </button>
        {isDuplicate && (
          <p className="form-note">Floor {selectedFloor} is already requested.</p>
        )}
      </form>
    </div>
  );
}
