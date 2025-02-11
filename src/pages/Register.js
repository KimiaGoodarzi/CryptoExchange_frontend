import React from "react";
import {useState} from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

    function Register() {

    const [username, setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try{
            const response = await axios.post("http://localhost:8080/api/register", {
            username,
            email,
             password,
             });

            alert("Registration successful! You can now log in.");
            navigate("/login");
        }
        catch (error){
        setError("Registration failed :( ")
        }

    };

    return(

    <div className="register-container">
    <h1>Register</h1>
    <form onSubmit = {handleRegister}>
    <div>
    <label>Username</label>
    <input
    type= "text"
    value = {username}
    onChange = {(e) =>{
    setUsername(e.target.value);
    setError("");
    }}
    required
    />
    </div>

   <div>
   <label>Email</label>
   <input
   type = "email"
   value = {email}
   onChange= {(e) => {
   setEmail(e.target.value);
   setError("");
   }}
   required
   />
   </div>
   <div>
   <label>Password</label>
   <input
   type= "password"
   value = {password}
   onChange = {(e) => {
   setPassword(e.target.value);
   setError("");

   }}
   required
   />
   </div>
   {error && <p className="error">{error}</p> }
   <button type="submit">Register</button>
   </form>
   </div>
    );



    }
    export default Register;

