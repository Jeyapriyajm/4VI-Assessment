import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";  
import "react-toastify/dist/ReactToastify.css"; 
import "../App.css";

function RentBikeForm() {
  const [formData, setFormData] = useState({
    name: "",
    nic: "",
    rentalDate: "",
    returnDate: "",
    email: "",
    phoneNumber: "",
    driverNeeded: "No",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Please log in to continue.');
      window.location.href = "/login";
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/rentals', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Rental submitted:', response.data);

  
      toast.success("Rental submitted successfully!", {
        position: "bottom-center",
        autoClose: 3000, 
        hideProgressBar: true, 
        closeOnClick: true, 
        pauseOnHover: true,
        draggable: true, 
        progress: undefined,
      });

      setFormData({
        name: "",
        nic: "",
        rentalDate: "",
        returnDate: "",
        email: "",
        phoneNumber: "",
        driverNeeded: "No",
      });
    } catch (error) {
      console.error('Error submitting rental:', error);
      toast.error('An error occurred while submitting your rental. Please try again.', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <div className="rent-bike-form">
      <h1>Rent a Bike</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          NIC Number:
          <input
            type="text"
            name="nic"
            value={formData.nic}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Rental Date:
          <input
            type="date"
            name="rentalDate"
            value={formData.rentalDate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Return Date:
          <input
            type="date"
            name="returnDate"
            value={formData.returnDate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Phone Number:
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Driver Needed?
          <select
            name="driverNeeded"
            value={formData.driverNeeded}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <button type="submit">Submit Rental</button>
      </form>
    </div>
  );
}

export default RentBikeForm;
