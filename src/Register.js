import React, { useState } from "react";
import "./Register.css";

function Register(){

const [username,setUsername]=useState("")
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [role,setRole]=useState("student")

const handleRegister = async () => {

await fetch("https://job-portal-backend-p580.onrender.com/api/register/",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
username,
email,
password,
role
})
})

alert("Registered Successfully ✅")

}

return(

<div className="register-page">

<div className="register-card">

<h2>🚀 Create Account</h2>

<input
placeholder="Username"
onChange={(e)=>setUsername(e.target.value)}
/>

<input
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<select onChange={(e)=>setRole(e.target.value)}>
<option value="student">Student</option>
<option value="recruiter">Recruiter</option>
</select>

<button onClick={handleRegister}>Register</button>

<p className="login-link">
Already have an account? <a href="/">Login</a>
</p>

</div>

</div>

)

}

export default Register