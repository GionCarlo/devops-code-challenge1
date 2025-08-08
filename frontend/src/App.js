import React, { useEffect, useState } from "react";
import "./App.css";
import config from "./config";

function App() {
  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setFailureMessage] = useState("");
  const [rawBody, setRawBody] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchApi = async () => {
    setLoading(true);
    setFailureMessage("");
    setSuccessMessage("");
    setRawBody("");

    try {
      const resp = await fetch(config.backendUrl, {
        headers: { Accept: "application/json" },
      });

      const text = await resp.text(); // read as text first (works for JSON or HTML)
      setRawBody(text?.slice(0, 300)); // helpful for debugging

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
      }

      // Try to parse JSON body
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Backend did not return valid JSON");
      }

      // Expecting { id: "<GUID or message>" }
      if (data && (data.id || data.message)) {
        setSuccessMessage(data.id || data.message);
      } else {
        setSuccessMessage(JSON.stringify(data));
      }
    } catch (e) {
      setFailureMessage(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App" style={{ padding: 16, fontFamily: "sans-serif" }}>
      <h2>Frontend → Backend check</h2>
      <div style={{ marginBottom: 8 }}>Backend URL: <code>{config.backendUrl}</code></div>

      {loading && <div>Fetching…</div>}
      {!loading && failureMessage && (
        <div style={{ color: "crimson" }}>
          <strong>Error:</strong> {failureMessage}
          {rawBody ? (
            <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: 8, marginTop: 8 }}>
              {rawBody}
            </pre>
          ) : null}
        </div>
      )}
      {!loading && successMessage && (
        <div style={{ color: "green" }}>
          <strong>SUCCESS:</strong> {successMessage}
        </div>
      )}

      <button onClick={fetchApi} style={{ marginTop: 12 }}>
        Retry
      </button>
    </div>
  );
}

export default App;

