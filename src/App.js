import React, { useState, useEffect } from "react";

const API_BASE = "https://job-portal-backend-p580.onrender.com";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [message, setMessage] = useState("");

  // 🔐 Login
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setMessage("Invalid Credentials ❌");
        return;
      }

      const data = await res.json();
      localStorage.setItem("access", data.access);
      setIsLoggedIn(true);
      fetchUser(data.access);

    } catch {
      setMessage("Server Error");
    }
  };

  // 🔎 Fetch Current User
  const fetchUser = async (token) => {
    const res = await fetch(`${API_BASE}/api/user/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setRole(data.role);
  };

  // 📌 Fetch Jobs
  const fetchJobs = async () => {
    const token = localStorage.getItem("access");

    const res = await fetch(`${API_BASE}/api/jobs/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (Array.isArray(data)) setJobs(data);
    else if (Array.isArray(data.results)) setJobs(data.results);
  };

  // 📌 Student Applications
  const fetchMyApplications = async () => {
    const token = localStorage.getItem("access");

    const res = await fetch(
      `${API_BASE}/api/applications/my-applications/`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    if (res.ok) setApplications(data);
  };

  // 📌 Recruiter Applications
  const fetchAllApplications = async () => {
    const token = localStorage.getItem("access");

    const res = await fetch(`${API_BASE}/api/applications/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (res.ok) setAllApplications(data);
  };

  useEffect(() => {
  if (isLoggedIn) {
    fetchProfile();
  }
}, [isLoggedIn]);

useEffect(() => {
  if (isLoggedIn && role) {
    fetchJobs();

    if (role === "student") fetchMyApplications();
    if (role === "recruiter") fetchAllApplications();
  }
}, [role]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole(null);
  };

  const applyJob = async (jobId) => {
    const token = localStorage.getItem("access");

    await fetch(`${API_BASE}/api/apply/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ job: jobId }),
    });

    fetchMyApplications();
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("access");

    await fetch(
      `${API_BASE}/api/applications/${id}/update-status/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    fetchAllApplications();
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Job Portal Login</h1>
        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />
        <button onClick={handleLogin}>Login</button>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>{role === "recruiter" ? "Recruiter Dashboard" : "Student Dashboard"}</h1>
      <button onClick={handleLogout}>Logout</button>

      {/* STUDENT */}
      {role === "student" && (
        <>
          <h2>Available Jobs</h2>
          {jobs.map((job) => {
            const application = applications.find(
              (app) => app.job === job.id
            );

            return (
              <div key={job.id} style={{ border: "1px solid #ccc", padding: 15, margin: 10 }}>
                <h3>{job.title}</h3>
                <p>{job.description}</p>

                {application ? (
                  <p>Status: <strong>{application.status}</strong></p>
                ) : (
                  <button onClick={() => applyJob(job.id)}>Apply</button>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* RECRUITER */}
      {role === "recruiter" && (
        <>
          <h2>All Applications</h2>

          {allApplications.map((app) => (
            <div key={app.id} style={{ border: "1px solid #ccc", padding: 15, margin: 10 }}>
              <h3>Job: {app.job_title}</h3>
              <p>Applicant: {app.applicant_username}</p>
              <p>Status: {app.status}</p>

              <button onClick={() => updateStatus(app.id, "SELECTED")}>
                Select
              </button>

              <button onClick={() => updateStatus(app.id, "REJECTED")}>
                Reject
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;