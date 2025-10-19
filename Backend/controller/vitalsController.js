const Vital = require('../models/vital');

exports.addVital = async (req, res) => {
  try {
    const { bp, sugar, weight, date, notes } = req.body;
    const vital = await Vital.create({ userId: req.user.userId, bp, sugar, weight, date, notes });
    res.status(201).json({ message: 'Vital added', vital });
  } catch (err) {
    console.error('Add vital error', err);
    res.status(500).json({ error: 'Could not add vital' });
  }
};

exports.getVitals = async (req, res) => {
  try {
    const vitals = await Vital.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json({ vitals });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch vitals' });
  }
};
