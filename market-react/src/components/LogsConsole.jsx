export default function LogsConsole({ logs }) {
  return (
    <div className="logs-area" id="logs-list">
      {logs.length === 0 ? (
        <p className="log-empty">No hay logs aún. Inicia una petición para ver el diagnóstico.</p>
      ) : (
        logs.map((log, index) => (
          <div key={`${log.time}-${index}`} className={`log-item ${log.type}`}>
            <span className="log-time">{log.time}</span>
            <span className="log-text">{log.message}</span>
          </div>
        ))
      )}
    </div>
  );
}
