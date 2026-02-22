import { useEffect, useState } from "react";

function StudentDashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");

    fetch("https://job-portal-backend-p580.onrender.com/api/profile/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
      });
  }, []);

  return (
    <div>
      <h2>Student Dashboard</h2>

      {profile && (
        <div>
          <h3>Welcome, {profile.username} 👋</h3>
          <p>Email: {profile.email}</p>
        </div>
      )}

      {/* Jobs section yaha rahega */}
    </div>
  );
}

export default StudentDashboard;