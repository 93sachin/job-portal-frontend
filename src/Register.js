import React, { useState } from "react";

function Register() {

const [username,setUsername]=useState("")
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [role,setRole]=useState("student")

const handleRegister = async () => {

const response = await fetch(
"https://job-portal-backend-p580.onrender.com/api/register/",
{
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

if(response.ok){
alert("Registered Successfully ✅")
}else{
alert("Registration Failed ❌")
}

}

return (

<div style={{textAlign:"center",marginTop:"100px"}}>

<h2>Register</h2>

<input
placeholder="Username"
onChange={(e)=>setUsername(e.target.value)}
/>

<br/><br/>

<input
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<br/><br/>

<input
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<br/><br/>

<select onChange={(e)=>setRole(e.target.value)}>

<option value="student">Student</option>
<option value="recruiter">Recruiter</option>

</select>

<br/><br/>

<button onClick={handleRegister}>Register</button>

</div>

)

}

export default Register;