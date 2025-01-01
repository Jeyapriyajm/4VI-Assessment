import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const SignUp = () => {
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  
  const validateForm = () => {
    const errors = {};

    if (!username) {
      errors.username = "Username is required";
    } else if (!/^[A-Za-z0-9_]{3,15}$/.test(username)) {
      errors.username = "Username should be 3-15 characters long and can only contain letters, numbers, and underscores.";
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!mobile) {
      errors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(mobile)) {
      errors.mobile = "Mobile number should be 10 digits";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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

    try {
      const response = await axios.post("http://localhost:3000/api/auth/signup", {
        username,
        email,
        mobile,
        password,
      });

      if (response.data.success) {
        toast.success("Sign-up successful!", {
          position: "top-center",
          progress: undefined,
          style: { backgroundColor: "green", color: "white" }, 
        });

        
        const loginResponse = await axios.post("http://localhost:3000/api/auth/login", {
          email,
          password,
        });

        if (loginResponse.data.success) {
          const token = loginResponse.data.token;
          localStorage.setItem("token", token); 
          navigate("/homeScreen"); 
        } else {
          toast.error("Login failed after sign-up");
        }
      } else {
        toast.error(response.data.message || "Sign-up failed");
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="sign-up-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

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
          <label>Mobile No</label>
          <input
            type="tel"
            name="mobile"
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          {errors.mobile && <span className="error-message">{errors.mobile}</span>}
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

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className="sign-up-btn">
          Sign Up
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login" className="toggle-link">Login</Link>
      </p>
    </div>
  );
};

export default SignUp;
