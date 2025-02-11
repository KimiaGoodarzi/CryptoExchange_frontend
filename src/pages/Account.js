
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
function Account(){

const [user, setUser] = useState(null);
const [error, setError] = useState("");
const navigate = useNavigate();

useEffect( () => {

    const token = localStorage.getItem("token");
    if(!token){
        navigate("/login");
        return;
    }

    axios.get("http://localhost:8080/api/me" , {
    headers: {Authorization :`Bearer ${token}`  },
    }).then( (response) => {setUser(response.data);  })
    .catch((err) => {
     console.error("Error fetching user data: ", err);
     setError("Failed to load account details.");
     localStorage.removeItem("token");
             navigate("/login");
    });

    },[navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if(error) return <p>{error}</p>
    if(!user) return <p>Loading...</p>;


    return(

    <div className= "account-container">
    <h1>My Account</h1>
    <p><strong>Username:</strong> {user.username}</p>
    <p><strong>Email:</strong> {user.email}</p>
    <p><strong>Account Created:</strong> {user.createdAt}</p>

     <button onClick={handleLogout}>Logout</button>
     </div>

    );

}
export default Account;
