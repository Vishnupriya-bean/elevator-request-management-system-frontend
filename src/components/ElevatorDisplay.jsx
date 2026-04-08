import { useEffect, useRef } from "react";

export default function ElevatorDisplay({ currentFloor, isMoving, direction: elevatorDirection, nextStop, queueCount, queue }) {
  const prevFloor = useRef(currentFloor);
  const calculatedDirection = currentFloor > prevFloor.current ? "up"
    : currentFloor < prevFloor.current ? "down"
      : null;

  useEffect(() => {
    prevFloor.current = currentFloor;
  }, [currentFloor]);

  const effectiveDirection = elevatorDirection || calculatedDirection || "idle";
  const directionIcon = effectiveDirection === "up" ? "▲"
    : effectiveDirection === "down" ? "▼"
      : "●";

  const directionText = effectiveDirection === "up" ? "going up"
    : effectiveDirection === "down" ? "going down"
      : "idle";

  const activeRequest = queue.find((r) => r.status === "in_progress");
  const statusText = isMoving
    ? `Moving from ${prevFloor.current} → ${nextStop ?? "…"}`
    : queueCount > 0
      ? `Queued for floor ${nextStop ?? queue[0]?.floor}`
      : `Idle at floor ${currentFloor}`;

  return (
    <div className="elevator-card">
      <div className="elevator-inner">
        {/* elevator shaft visual */}
        <div className="shaft">
          <div
            className="cabin"
            style={{ bottom: `${(currentFloor - 1) * 10 + 1}%` }}
          />
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="floor-mark">
              <span>{10 - i}</span>
            </div>
          ))}
        </div>

        {/* status and info panel */}
        <div className="elevator-info">
          <p className="elev-label">current floor</p>
          <div className={`floor-number ${isMoving ? "floor-pulse" : ""}`}>
            {currentFloor}
          </div>

          <div className="direction-badge">
            <span className={`dir ${elevatorDirection}`}>{directionIcon} {directionText}</span>
          </div>

          <p className="elev-target status-text">
            {statusText}
          </p>

          <div className="elev-stats">
            <div className="stat">
              <span className="stat-val">{queueCount}</span>
              <span className="stat-label">{queueCount === 1 ? "request waiting" : "requests waiting"}</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-val">{activeRequest ? activeRequest.floor : "—"}</span>
              <span className="stat-label">current target</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
