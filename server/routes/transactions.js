import express from 'express';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import Advertisement from '../models/Advertisement.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const FEE_PERCENTAGE = 0.03; // 3% fee

router.post('/initiate', auth, async (req, res) => {
  try {
    const { receiverId, amount, proximityLimit, timeLimit, useWallet, useGeofence, senderLocation } = req.body;
    const sender = await User.findById(req.user.id);
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(400).json({ message: 'Receiver not found' });
    }

    const fee = amount * FEE_PERCENTAGE;
    const totalAmount = amount + fee;

    if (useWallet && sender.balance < totalAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date(Date.now() + timeLimit * 60000);

    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      fee,
      status: 'pending',
      verificationCode,
      expiresAt,
      proximityLimit,
      useWallet,
      useGeofence,
      senderLocation
    });

    await transaction.save();

    res.json({ message: 'Transaction initiated', verificationCode, fee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ... (keep other existing routes)

router.get('/advertisements', auth, async (req, res) => {
  try {
    const ads = await Advertisement.find({ 
      isActive: true, 
      startDate: { $lte: new Date() }, 
      endDate: { $gte: new Date() } 
    }).limit(3);

    // Increment impressions
    await Advertisement.updateMany(
      { _id: { $in: ads.map(ad => ad._id) } },
      { $inc: { impressions: 1 } }
    );

    res.json(ads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/ad-click/:adId', auth, async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.adId);
    if (!ad) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }
    ad.clicks += 1;
    await ad.save();
    res.json({ message: 'Click recorded' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;