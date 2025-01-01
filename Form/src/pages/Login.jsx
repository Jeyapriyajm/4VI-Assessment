import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../App.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true); 
    try {
      console.log("Attempting to login with:", { email, password }); 

      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      console.log("Login response:", response.data); 

      if (response.data.success) {
        toast.success("Login successful!");
        const token = response.data.token;
        localStorage.setItem("token", token);
        fetchUserDetails(token);
        navigate("/homeScreen");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again later.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false); 
    }
  };

  // Fetch user details after login
  const fetchUserDetails = async (token) => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/get-userDetails', {
        headers: {
          Authorization: `Bearer ${token}`, 
        }
      });
      console.log(response.data); 
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error("Error fetching user details");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p>
            Don't have an account?{" "}
            <Link to="/signUp" className="toggle-link">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
