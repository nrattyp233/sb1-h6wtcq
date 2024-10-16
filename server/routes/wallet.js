import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      balance: user.balance,
      geofence: user.geofence,
      linkedBanks: user.linkedBanks
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.post('/geofence', auth, async (req, res) => {
  try {
    const { lat, lng, radius } = req.body;
    const user = await User.findById(req.user.id);
    user.geofence = { lat, lng, radius };
    await user.save();
    res.json({ message: 'Geofence updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.post('/link-bank', auth, async (req, res) => {
  try {
    const { bankName, accountNumber, routingNumber } = req.body;
    const user = await User.findById(req.user.id);
    user.linkedBanks.push({ bankName, accountNumber, routingNumber });
    await user.save();
    res.json({ message: 'Bank account linked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.post('/add-funds', auth, async (req, res) => {
  try {
    const { amount, bankId } = req.body;
    const user = await User.findById(req.user.id);
    const linkedBank = user.linkedBanks.id(bankId);

    if (!linkedBank) {
      return res.status(400).json({ message: 'Bank account not found' });
    }

    // In a real-world scenario, you would integrate with a payment processor here
    // For this example, we'll just add the funds directly
    user.balance += parseFloat(amount);
    await user.save();

    res.json({ message: 'Funds added successfully', newBalance: user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

export default router;