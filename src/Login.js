import {useNavigate} from "react-router-dom";
import React, { useState } from "react";
import "./Login.css";

// ================= LOGIN COMPONENT =================
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("LOGIN RESPONSE:", data);

      if (response.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("role",data.role);
        
        if (data.role === "recruiter"){
          navigate("/recruiter-dashboard");
        }else{
          navigate("/dashboard"); 
        } 

      } else {
        alert("Invalid Credentials ❌");
      }
    } catch (error) {
      alert("Server Error ❌");
    }
  };
return (
<div className="login-page">
  <div className="login-container">
    <h2>🚀 Job Portal Login</h2>

    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button onClick={handleLogin}>Login</button>

    <p>Welcome Back 👋</p>
  </div>
</div>
);
}

export default Login;