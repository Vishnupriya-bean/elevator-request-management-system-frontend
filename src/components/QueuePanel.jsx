export default function QueuePanel({ queue }) {
  const pending = queue.filter((r) => r.status === "pending");
  const inProgress = queue.find((r) => r.status === "in_progress");

  return (
    <div className="panel queue-panel">
      <h2 className="panel-title">
        live queue
        <span className="queue-meta">{queue.length} {queue.length === 1 ? "request" : "requests"} waiting</span>
      </h2>

      {queue.length === 0 ? (
        <p className="empty-msg">no pending requests</p>
      ) : (
        <ul className="queue-list">
          {inProgress && (
            <li className="queue-item queue-item--active">
              <span className="badge badge-blue">in progress</span>
              <span className="queue-floor">floor {inProgress.floor}</span>
              <span className="queue-user">{inProgress.username}</span>
            </li>
          )}
          {pending.map((r) => (
            <li key={r.id} className="queue-item">
              <span className="badge badge-yellow">pending</span>
              <span className="queue-floor">floor {r.floor}</span>
              <span className="queue-user">{r.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
