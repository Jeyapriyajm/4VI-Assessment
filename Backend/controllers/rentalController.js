import Rental from '../models/rental.js'; 
import mongoose from 'mongoose';
import User from '../models/userModel.js'; 


export const submitRental = async (req, res) => {
  const { name, nic, rentalDate, returnDate, email, phoneNumber, driverNeeded } = req.body;

  
  if (!name || !nic || !rentalDate || !returnDate || !email || !phoneNumber) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const newRental = new Rental({
      name,
      nic,
      rentalDate,
      returnDate,
      email,
      phoneNumber,
      driverNeeded,
      user: req.user.userId, 
    });

    await newRental.save();
    const user = await User.findById(req.user.userId);
    if (user) {
      user.rentals.push(newRental._id);
      await user.save();
    }

    res.status(201).json({ success: true, message: 'Rental successfully submitted!' });
  } catch (error) {
    console.error('Error submitting rental:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};
export const getUserRentals = async (req, res) => {
  try {
    const userRentals = await Rental.find({ user: req.user.userId }).populate('user', 'username email');
    if (!userRentals || userRentals.length === 0) {
      return res.status(404).json({ success: false, message: 'No rentals found for this user' });
    }
    res.status(200).json({ success: true, rentals: userRentals });
  } catch (error) {
    console.error('Error fetching rentals:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

export const updateRental = async (req, res) => {
  const rentalId = req.params.id;
  const { name, nic, rentalDate, returnDate, email, phoneNumber, driverNeeded } = req.body;


  if (!name || !nic || !rentalDate || !returnDate || !email || !phoneNumber) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental not found' });
    }

    if (rental.user.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this rental' });
    }
    rental.name = name || rental.name;
    rental.nic = nic || rental.nic;
    rental.rentalDate = rentalDate || rental.rentalDate;
    rental.returnDate = returnDate || rental.returnDate;
    rental.email = email || rental.email;
    rental.phoneNumber = phoneNumber || rental.phoneNumber;
    rental.driverNeeded = driverNeeded || rental.driverNeeded;
    await rental.save();

    res.status(200).json({ success: true, message: 'Rental successfully updated', rental });
  } catch (error) {
    console.error('Error updating rental:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};
export const deleteRental = async (req, res) => {
  const rentalId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(rentalId)) {
    return res.status(400).json({ message: 'Invalid rental ID' });
  }

  try {
    const rental = await Rental.findByIdAndDelete(rentalId);

    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    console.log('Rental deleted:', rental);
    return res.status(200).json({ message: 'Rental deleted successfully' });
  } catch (error) {
    console.error('Error deleting rental:', error);
    return res.status(500).json({ message: 'Error deleting rental' });
  }
};


