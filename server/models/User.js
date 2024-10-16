import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  geofence: {
    lat: Number,
    lng: Number,
    radius: Number
  },
  linkedBanks: [{
    bankName: String,
    accountNumber: String,
    routingNumber: String
  }]
});

export default mongoose.model('User', userSchema);