const labelRepo = require('../repositories/labelRepo');
const taskRepo  = require('../repositories/taskRepo');

const COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

function validate({ name, color }) {
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0)
      return 'Label name is required';
    if (name.trim().length > 50)
      return 'Label name must be 50 characters or less';
  }
  if (color !== undefined && !COLOR_REGEX.test(color))
    return 'Color must be a valid hex code (e.g. #ff0000)';
  return null;
}

function getLabels() {
  return labelRepo.findAll();
}

function getLabel(id) {
  return labelRepo.findById(id) || null;
}

function createLabel(data) {
  const error = validate(data);
  if (error) throw Object.assign(new Error(error), { status: 400 });
  if (!data.name) throw Object.assign(new Error('Label name is required'), { status: 400 });
  data.name = data.name.trim();
  if (labelRepo.findByName(data.name))
    throw Object.assign(new Error('Label name already exists'), { status: 409 });
  return labelRepo.create(data);
}

function updateLabel(id, data) {
  if (!labelRepo.findById(id)) return null;
  const error = validate(data);
  if (error) throw Object.assign(new Error(error), { status: 400 });
  if (data.name) {
    data.name = data.name.trim();
    const existing = labelRepo.findByName(data.name);
    if (existing && existing.id !== id)
      throw Object.assign(new Error('Label name already exists'), { status: 409 });
  }
  return labelRepo.update(id, data);
}

function deleteLabel(id) {
  if (!labelRepo.findById(id)) return false;
  labelRepo.remove(id);
  return true;
}

function addLabelToTask(taskId, labelId) {
  if (!taskRepo.findById(taskId))
    throw Object.assign(new Error('Task not found'), { status: 404 });
  if (!labelRepo.findById(labelId))
    throw Object.assign(new Error('Label not found'), { status: 404 });
  labelRepo.addToTask(taskId, labelId);
}

function removeLabelFromTask(taskId, labelId) {
  if (!taskRepo.findById(taskId))
    throw Object.assign(new Error('Task not found'), { status: 404 });
  if (!labelRepo.findById(labelId))
    throw Object.assign(new Error('Label not found'), { status: 404 });
  labelRepo.removeFromTask(taskId, labelId);
}

module.exports = { getLabels, getLabel, createLabel, updateLabel, deleteLabel, addLabelToTask, removeLabelFromTask };
