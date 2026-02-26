import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import "./App.css";
import "./RecruiterDashboard.css";
import { useNavigate } from "react-router-dom";
ChartJS.register(ArcElement, Tooltip, Legend);

function RecruiterDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [myJobs, setMyJobs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [analytics, setAnalytics] = useState({
  total_jobs: 0,
  total_applications: 0,
  shortlisted: 0,
  rejected: 0,
  pending: 0
});
  const [applications, setApplications] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");
  const navigate = useNavigate();
  const [newCount, setNewCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

const handleLogout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("role");
  navigate("/");
};

  // 🔥 Fetch My Jobs
  const fetchMyJobs = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/jobs/list/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setMyJobs(Array.isArray(data) ? data : []);
      setNewCount(Array.isArray(data) ? data.reduce((sum, job) => sum + job.new_applications,0)
      :0
      );
    } catch (error) {
      console.log("Error fetching jobs:", error);
    }
  };

  const fetchNewApplicationsCount = async () => {
  try {
    const token = localStorage.getItem("access");

    const response = await fetch(
      "http://localhost:8000/api/jobs/new-applications-count/",
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    setNewCount(data.new_applications);

  } catch (error) {
    console.error("Error fetching new applications count", error);
  }
};

  useEffect(() => {
    fetchMyJobs();
    fetchNewApplicationsCount();
  }, []);

  useEffect(() => {
  fetch("http://127.0.0.1:8000/api/jobs/analytics", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  })
    .then(async (res) => {
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        console.log("Analytics Data:", data);
        setAnalytics(data);
      } catch (err) {
        console.error("Not JSON Response:", text);
      } finally {
        setLoading(false);
      }
    })
    .catch((err) => console.error("Fetch error:", err));
}, []);

  // 🔥 Create or Update Job
  const handlePostJob = async () => {
    const url = editId
      ? `http://127.0.0.1:8000/api/jobs/update/${editId}/`
      : "http://127.0.0.1:8000/api/jobs/create/";

    const method = editId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, company }),
      });

      if (response.ok) {
        alert(editId ? "Job Updated ✅" : "Job Posted ✅");

        setTitle("");
        setDescription("");
        setCompany("");
        setEditId(null);

        fetchMyJobs();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Job
  const handleDelete = async (id) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/jobs/delete/${id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      setMyJobs(myJobs.filter((job) => job.id !== id));
    }
  } catch (error) {
    console.log(error);
  }
};

  // 🔥 Edit Job
const handleEdit = (job) => {
  if (editId === job.id) {
    // cancel edit
    setEditId(null);
    setTitle("");
    setDescription("");
    setCompany("");
  } else {
    setEditId(job.id);
    setTitle(job.title);
    setDescription(job.description);
    setCompany(job.company);
  }
};

  // 🔥 View Applications
const handleViewApplications = async (jobId) => {

  // 🔥 Toggle Logic
  if (selectedJobId === jobId) {
    setSelectedJobId(null);   // already open hai → close
    return;
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/jobs/applications/${jobId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    setApplications(data);
    setSelectedJobId(jobId);
    setNewCount(0);

  } catch (error) {
    console.log(error);
  }
};

  // 🔥 Update Application Status
const handleUpdateStatus = async (applicationId, status) => {
  try {
    await fetch(
      `http://127.0.0.1:8000/api/jobs/application/update/${applicationId}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    // 🔥 Only refresh applications — don't toggle
    const response = await fetch(
      `http://127.0.0.1:8000/api/jobs/applications/${selectedJobId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    setApplications(data);

  } catch (error) {
    console.log(error);
  }
};

const cardStyle = {
  padding: "24px",
  background: "white",
  borderRadius: "20px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
};

return (
  <div className="recruiter-dashboard">
    <div className="top-navbar">
    <h1 className="dashboard-title">Recruiter Dashboard 👨‍💼</h1>

    <div className="nav-right">
    <div className="notification-bell"
          onClick={() => setShowNotifications(!showNotifications)}
    >
      🔔
      {newCount > 0 && (
        <span className="notification-count">
          {newCount}
        </span>
      )}

      {showNotifications && (
        <div className="Notifications-dropdown">
          <p>{newCount} new applications</p>
          </div>
      )}
    </div>
    
    <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
        </div>

    {/* ===== Analytics Section ===== */}
    <div className="analytics-section">

      <div className="recruiter-cards">

  <div className="recruiter-card total">
    <h3>Total Jobs</h3>
    <h2>{analytics.total_jobs}</h2>
  </div>

  <div className="recruiter-card apps">
    <h3>Total Applications</h3>
    <h2>{analytics.total_applications}</h2>
  </div>

  <div className="recruiter-card short">
    <h3>Shortlisted</h3>
    <h2>{analytics.shortlisted}</h2>
  </div>

  <div className="recruiter-card reject">
    <h3>Rejected</h3>
    <h2>{analytics.rejected}</h2>
  </div>

  <div className="recruiter-card pending">
    <h3>Pending</h3>
    <h2>{analytics.pending}</h2>
  </div>
</div>
</div>

      <div className="chart-box">
  <Pie
    data={{
      labels: ["Shortlisted", "Rejected", "Pending"],
      datasets: [
        {
          data: [
            analytics.shortlisted,
            analytics.rejected,
            analytics.pending
          ],
          backgroundColor: [
            "#00b09b",
            "#ff416c",
            "#f7971e"
          ],
          borderWidth: 0
        }
      ]
    }}
    options={{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            font: { size: 14 }
          }
        }
      }
    }}
  />
</div>

    </div>

    {/* ===== Job Form Section ===== */}
    <div className="form-section">

      <h2>Post a Job</h2>

      <input
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <button onClick={handlePostJob}>
        {editId ? "Update Job" : "Post Job"}
      </button>

    </div>

    {/* ===== My Jobs Section ===== */}
    <div className="jobs-section">

      <h2>My Posted Jobs</h2>

      {myJobs.map((job) => (
       <div key={job.id} className="job-card">

            <div className="job-header">
    <h3>
        {job.title}

        {job.new_applications > 0 && (
            <span className="new-badge">
                🔴 {job.new_applications} New
            </span>
        )}
    </h3>

    <span className="company-name">{job.company}</span>
</div>

            <p className="job-description">{job.description}</p>

            <div className="job-buttons">
              <button className="delete-btn" onClick={() => handleDelete(job.id)}>
                Delete
              </button>

              <button className="edit-btn" onClick={() =>handleEdit(job)}>
                {editId === job.id ? "Cancel" : "Edit"}
              </button>

              <button className="view-btn" onClick={() => handleViewApplications(job.id)}>
                View Applications
              </button>
            </div>

                  {/* 🔥 Applications Section */}
          {selectedJobId === job.id && (
            <div style={{ marginTop: "15px", background: "#f5f5f5", padding: "10px" }}>
              <h4>Applications:</h4>

              {applications.length === 0 ? (
                <p>No applications yet.</p>
              ) : (
                applications.map((app) => (
                  <div key={app.id} style={{ marginBottom: "10px" }}>
                    <p><strong>User:</strong> {app.username}</p>
                    <p>
                        <strong>Status:</strong>{" "}
                        <span
                            style={{
                            padding: "4px 8px",
                            borderRadius: "5px",
                            color: "white",
                            backgroundColor:
                                app.status === "SHORTLISTED"
                                ? "green"
                                : app.status === "REJECTED"
                                ? "red"
                                : "gray",
                            }}
                        >
                            {app.status}
                        </span>
                    </p>

                    {app.resume && (
                    <div style={{ margin: "5px 0" }}>
                        <a
                        href={`http://127.0.0.1:8000${app.resume}`}
                        target="_blank"
                        rel="noreferrer"
                        >
                        Download Resume
                        </a>
                    </div>
                    )}

                    <button
                      onClick={() => handleUpdateStatus(app.id, "SHORTLISTED")}
                      style={{ marginRight: "8px" }}
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                    >
                      Reject
                    </button>

                    <hr />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}
    </div>
    </div>
);
}

export default RecruiterDashboard;