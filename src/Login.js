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
      const response = await fetch("https://job-portal-backend-p580.onrender.com/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          username, 
          password 
        }),
      });

      const data = await response.json();
      console.log("LOGIN RESPONSE:", data);
      console.log("TOKEN:", data.access);

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

    <button type="button" onClick={handleLogin}>
      Login
    </button>

    <p style={{marginTop:"15px"}}>
      Don't have an account?{" "}
      <span 
        style={{color:"blue",cursor:"pointer"}}
        onClick={() => navigate("/register")}
      >
        Register
      </span>
    </p>

    <p>Welcome Back 👋</p>
  </div>
</div>
);
}

export default Login;