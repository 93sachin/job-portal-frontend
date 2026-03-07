import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://job-portal-backend-p580.onrender.com/api/applications/my-applications/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setApplications(data));
  }, [token]);

  return (
    <div className="app-container">
      <h1 className="app-title">📄 My Applications</h1>

      <button onClick={() => navigate("/dashboard")} className="back-btn">
        ⬅ Back to Dashboard
      </button>

      {applications.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No applications yet 😢
        </p>
      ) : (
        applications.map((app) => (
          <div key={app.id} className="app-card">

            <h3>💼 {app.job_title}</h3>

      <p>
        <strong>Status:</strong>{" "}
        <span className={`status ${app.status.toLowerCase()}`}>
          {app.status}
        </span>
      </p>

      <p>
        <strong>Applied At:</strong>{" "}
        {new Date(app.applied_at).toLocaleString()}
      </p>

    </div>
        ))
  )}
</div>
  );
}

export default MyApplications;