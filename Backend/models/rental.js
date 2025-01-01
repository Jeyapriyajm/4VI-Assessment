
import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nic: { type: String, required: true },
  rentalDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  driverNeeded: { type: String, enum: ['Yes', 'No'], default: 'No' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
}, { timestamps: true });

export default mongoose.model('Rental', rentalSchema);
