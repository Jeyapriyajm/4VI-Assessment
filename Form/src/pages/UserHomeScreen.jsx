import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

function UserHomeScreen() {
  const [userData, setUserData] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:3000/api/auth/get-userDetails",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setUserData(response.data.user);
        const userInfo = {
          isLoggedIn: true,
          userData: response.data.user,
        };
        sessionStorage.setItem("userData", JSON.stringify(userInfo));
      } else {
        console.error(response.data.message || "Failed to fetch user details");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  const handleRentBike = () => {
    navigate("/rent-bike");
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/"); 
  };

  const handleRentalDetails = () => {
    navigate("/rental-details"); 
  };

  return (
    <div className="user-home-screen">



      <div className="navigation-buttons">
        <button onClick={handleRentalDetails}>
          <i className="fas fa-bicycle"></i> View Rental Details
        </button>
        <button onClick={handleLogout} className="logout">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      <div className="bike-gallery">
        <h2>Explore Our Rental Bikes</h2>
        <div className="bike-list">
          <div className="bike-item">
            <img
              src="/src/assets/picture1.png"
              alt="Bike 1"
              className="bike-image"
            />
            <h3>Bike 1</h3>
            <p>Comfortable and efficient for city rides.</p>
            <button onClick={handleRentBike}>Rent this Bike</button>
          </div>
          <div className="bike-item">
            <img
              src="/src/assets/picture2.jpg"
              alt="Bike 2"
              className="bike-image"
            />
            <h3>Bike 2</h3>
            <p>Perfect for long-distance adventures.</p>
            <button onClick={handleRentBike}>Rent this Bike</button>
          </div>
          <div className="bike-item">
            <img
              src="/src/assets/picture3.png"
              alt="Bike 3"
              className="bike-image"
            />
            <h3>Bike 3</h3>
            <p>Lightweight and easy to handle.</p>
            <button onClick={handleRentBike}>Rent this Bike</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHomeScreen;
