const express = require('express');
const router = express.Router();
const statsRepo = require('../repositories/statsRepo');

router.get('/', (req, res) => {
  res.json({ data: statsRepo.getSummary() });
});

module.exports = router;
