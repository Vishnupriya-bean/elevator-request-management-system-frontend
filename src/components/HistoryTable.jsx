function formatTime(dt) {
  return new Date(dt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

const BADGE = {
  pending:     "badge-yellow",
  in_progress: "badge-blue",
  done:        "badge-green",
};

export default function HistoryTable({ history }) {
  return (
    <div className="panel history-panel">
      <h2 className="panel-title">request history</h2>

      {history.length === 0 ? (
        <p className="empty-msg">no requests yet</p>
      ) : (
        <div className="table-wrap">
          <table className="history-table">
            <thead>
              <tr>
                <th>#</th>
                <th>user</th>
                <th>floor</th>
                <th>status</th>
                <th>time</th>
              </tr>
            </thead>
            <tbody>
              {history.map((r) => (
                <tr key={r.id}>
                  <td className="td-id">{r.id}</td>
                  <td>{r.username}</td>
                  <td className="td-floor">{r.from_floor}</td>
                  <td>
                    <span className={`badge ${BADGE[r.status] || ""}`}>
                      {r.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="td-time">{formatTime(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
