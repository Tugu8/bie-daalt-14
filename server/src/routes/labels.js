const express = require('express');
const router = express.Router();
const service = require('../services/labelService');

router.get('/', (req, res) => {
  res.json({ data: service.getLabels() });
});

router.get('/:id', (req, res) => {
  const label = service.getLabel(Number(req.params.id));
  if (!label) return res.status(404).json({ error: 'Label not found' });
  res.json({ data: label });
});

router.post('/', (req, res) => {
  try {
    const label = service.createLabel(req.body);
    res.status(201).json({ data: label });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const label = service.updateLabel(Number(req.params.id), req.body);
    if (!label) return res.status(404).json({ error: 'Label not found' });
    res.json({ data: label });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  const deleted = service.deleteLabel(Number(req.params.id));
  if (!deleted) return res.status(404).json({ error: 'Label not found' });
  res.status(200).json({ data: null, meta: { message: 'Label deleted' } });
});

// Task-д label нэмэх/хасах
router.post('/tasks/:taskId/labels/:labelId', (req, res) => {
  try {
    service.addLabelToTask(Number(req.params.taskId), Number(req.params.labelId));
    res.status(200).json({ data: null, meta: { message: 'Label added to task' } });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/tasks/:taskId/labels/:labelId', (req, res) => {
  try {
    service.removeLabelFromTask(Number(req.params.taskId), Number(req.params.labelId));
    res.status(200).json({ data: null, meta: { message: 'Label removed from task' } });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
