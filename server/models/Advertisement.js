import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema({
  company: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  clicks: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Advertisement', advertisementSchema);