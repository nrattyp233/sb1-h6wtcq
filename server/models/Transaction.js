import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  fee: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  verificationCode: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  proximityLimit: { type: Number, required: true },
  useWallet: { type: Boolean, default: false },
  useGeofence: { type: Boolean, default: false },
  senderLocation: {
    lat: Number,
    lng: Number
  },
  receiverLocation: {
    lat: Number,
    lng: Number
  }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);