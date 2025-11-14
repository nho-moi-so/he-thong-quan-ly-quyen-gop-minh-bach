const express = require('express');
const router = express.Router();
const Quy = require('../models/Quy');

// Tạo quỹ
router.post('/', async (req, res) => {
  try {
    const newQuy = await Quy.create(req.body);
    res.status(201).json(newQuy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy tất cả quỹ
router.get('/', async (req, res) => {
  try {
    const quyList = await Quy.find();
    res.json(quyList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
