import React from "react";
import "../App.css";
import picture1 from "../assets/picture1.png";  
import { Link } from "react-router-dom"; 

function Home() {
    return (
        <div className="home-container">
            <div className="banner">
                <h1>Welcome to Your Bike Rental Journey!</h1>
                <p>Discover the best bikes for rent in the city.</p>

        
                <div className="banner-image-container">
                    <img
                        src={picture1} 
                        alt="Bike Rental Banner"
                        className="banner-image"
                    />
                    <Link to="/signup">
                        <button className="get-started-btn">Get Started</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;
