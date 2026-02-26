import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import "./Layout.css";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [resume, setResume] = useState(null);
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

    const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  // Fetch jobs
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/jobs/list/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, [token]);

  // Fetch my applications
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/applications/my-applications/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const appliedIds = data.map((app) => app.job);
        setAppliedJobs(appliedIds);
      });
  }, [token]);

  const handleApply = async (jobId) => {
    if (!resume) {
      alert("Please upload resume");
      return;
    }

    const formData = new FormData();
    formData.append("job", jobId);
    formData.append("resume", resume);

    const response = await fetch(
      "http://127.0.0.1:8000/api/applications/apply/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: formData,
      }
    );

    if (response.status === 201) {
      alert("Applied Successfully ✅");
      setAppliedJobs([...appliedJobs, jobId]); // update UI instantly
    } else {
      alert("Already Applied ❌");
    }
  };

return (
  <div className="dashboard-container">

    <h1 className="dashboard-title">
      Student Dashboard 🚀
    </h1>

    <div className="top-buttons">
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>

      <button
        onClick={() => navigate("/my-applications")}
        className="application-btn"
      >
        View My Applications
      </button>
    </div>

  <div className="job-list">
    {jobs.map((job) => (
      <div key={job.id} className="job-card">
        <h3>{job.title}</h3>
        <p>{job.company}</p>
        <p>{job.description}</p>

        <input
          type="file"
          onChange={(e) => setResume(e.target.files[0])}
        />

        <br /><br />

        {appliedJobs.includes(job.id) ? (
          <button disabled>Applied ✓</button>
        ) : (
          <button onClick={() => handleApply(job.id)}>
            Apply Now
          </button>
        )}
      </div>
    ))}
  </div>
  </div>
);
}

export default Dashboard;