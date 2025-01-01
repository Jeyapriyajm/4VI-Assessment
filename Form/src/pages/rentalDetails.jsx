import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const RentalDetails = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRental, setSelectedRental] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    nic: '',
    rentalDate: '',
    returnDate: '',
    email: '',
    phoneNumber: '',
    driverNeeded: false,
  });

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/rentals', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setRentals(response.data.rentals);
        setLoading(false);
      } catch (err) {
        setError('Error fetching rental details');
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const handleUpdate = (id) => {
    const rentalToUpdate = rentals.find((rental) => rental._id === id);
    setSelectedRental(rentalToUpdate);
    setFormData({
      name: rentalToUpdate.name,
      nic: rentalToUpdate.nic,
      rentalDate: rentalToUpdate.rentalDate,
      returnDate: rentalToUpdate.returnDate,
      email: rentalToUpdate.email,
      phoneNumber: rentalToUpdate.phoneNumber,
      driverNeeded: rentalToUpdate.driverNeeded,
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/rentals/${selectedRental._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const updatedRentals = rentals.map((rental) =>
        rental._id === selectedRental._id ? response.data.rental : rental
      );
      setRentals(updatedRentals);
      setSelectedRental(null); 
    } catch (err) {
      setError('Error updating rental details');
    }
  };

  const handleDelete = async (id) => {
    try {
      // Send delete request to the backend
      const response = await axios.delete(`http://localhost:3000/api/rentals/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      // If the delete is successful, remove the rental from the state
      if (response.status === 200) {
        setRentals(rentals.filter((rental) => rental._id !== id));
      }
    } catch (err) {
      setError('Error deleting rental');
      console.error('Delete error:', err);
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h2 className="rental">Rental Details</h2>
      {rentals.length === 0 ? (
        <p className="no-rentals">No rentals found.</p>
      ) : (
        <ul>
          {rentals.map((rental) => (
            <li key={rental._id} className="rental-item">
              <p><span>Name:</span> {rental.name}</p>
              <p><span>NIC:</span> {rental.nic}</p>
              <p><span>Rental Date:</span> {new Date(rental.rentalDate).toLocaleDateString()}</p>
              <p><span>Return Date:</span> {new Date(rental.returnDate).toLocaleDateString()}</p>
              <p><span>Email:</span> {rental.email}</p>
              <p><span>Phone:</span> {rental.phoneNumber}</p>
              <p><span>Driver Needed:</span> {rental.driverNeeded ? 'Yes' : 'No'}</p>
              <div className="button-container">
                <button onClick={() => handleUpdate(rental._id)} className="update-button">Update</button>
                <button onClick={() => handleDelete(rental._id)} className="delete-button">Delete</button>

              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedRental && (
        <div className="update-form">
          <h3>Update Rental</h3>
          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
            />
            <label>NIC</label>
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleFormChange}
            />
            <label>Rental Date</label>
            <input
              type="date"
              name="rentalDate"
              value={formData.rentalDate}
              onChange={handleFormChange}
            />
            <label>Return Date</label>
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleFormChange}
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
            />
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleFormChange}
            />
            <label>Driver Needed</label>
            <input
              type="checkbox"
              name="driverNeeded"
              checked={formData.driverNeeded}
              onChange={handleFormChange}
            />
            <button type="submit">Update Rental</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RentalDetails;
