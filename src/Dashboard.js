import { useEffect, useState } from "react";

function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access");

    // 1️⃣ Profile Fetch
    fetch("https://job-portal-backend-p580.onrender.com/api/profile/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data));

    // 2️⃣ My Applications Fetch
    fetch("https://job-portal-backend-p580.onrender.com/api/application/my-application/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setApplications(data));
  }, []);

  return (
    <div>
      <h2>Student Dashboard</h2>

      {profile && (
        <div style={{marginTop: 20}}>
          <h3>Welcome, {profile.username} 👋</h3>
          <p>Email: {profile.email}</p>
        </div>
      )}

      <h3>My Applications</h3>
      {applications.map((app) => (
        <div key={app.id}>
          <p>Job: {app.job.title}</p>
          <p>Status: {app.status}</p>
        </div>
      ))}
    </div>
  );
}

export default StudentDashboard;