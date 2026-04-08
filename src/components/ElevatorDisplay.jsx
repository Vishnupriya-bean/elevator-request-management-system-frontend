import { useEffect, useRef } from "react";

export default function ElevatorDisplay({ currentFloor, isMoving, queue }) {
  const prevFloor  = useRef(currentFloor);
  const direction  = currentFloor > prevFloor.current ? "up"
                   : currentFloor < prevFloor.current ? "down"
                   : null;

  useEffect(() => {
    prevFloor.current = currentFloor;
  }, [currentFloor]);

  const target = queue.find((r) => r.status === "in_progress");

  return (
    <div className="elevator-card">
      <div className="elevator-inner">
        {/* shaft visual */}
        <div className="shaft">
          <div
            className="cabin"
            style={{ bottom: `${((currentFloor - 1) / 9) * 100}%` }}
          />
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="floor-mark">
              <span>{10 - i}</span>
            </div>
          ))}
        </div>

        {/* info panel */}
        <div className="elevator-info">
          <p className="elev-label">current floor</p>
          <div className={`floor-number ${isMoving ? "floor-pulse" : ""}`}>
            {currentFloor}
          </div>

          <div className="direction-badge">
            {isMoving && direction === "up"   && <span className="dir up">▲ going up</span>}
            {isMoving && direction === "down" && <span className="dir down">▼ going down</span>}
            {!isMoving && <span className="dir idle">● idle</span>}
          </div>

          {target && (
            <p className="elev-target">
              heading to floor <strong>{target.from_floor}</strong>
            </p>
          )}

          <div className="elev-stats">
            <div className="stat">
              <span className="stat-val">{queue.filter(q => q.status === "pending").length}</span>
              <span className="stat-label">waiting</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-val">{isMoving ? "yes" : "no"}</span>
              <span className="stat-label">moving</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
