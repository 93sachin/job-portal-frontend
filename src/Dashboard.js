import React, { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");

    fetch("https://job-portal-backend-p580.onrender.com/api/profile/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
      });
  }, []);

  return (
    <div>
      <h1>Student Dashboard</h1>

      {user && (
        <>
          <h2>Welcome {user.username}</h2>
          <p>Email: {user.email}</p>
        </>
      )}

      <h3>Available Jobs</h3>

      {/* Tumhara existing jobs code yaha rahega */}
    </div>
  );
}

export default Dashboard;