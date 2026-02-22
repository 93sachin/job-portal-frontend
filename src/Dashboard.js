import { useEffect, useState } from "react";

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
      .then(data => setUser(data));
  }, []);

  return (
    <div>
      <h2>Welcome {user?.username}</h2>
      <p>Email: {user?.email}</p>
    </div>
  );
}

export default Dashboard;