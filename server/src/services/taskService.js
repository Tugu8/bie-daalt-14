const repo = require('../repositories/taskRepo');

const VALID_PRIORITIES = ['high', 'medium', 'low'];
const VALID_STATUSES   = ['pending', 'done'];

function validate({ title, priority, status, due_date }) {
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0)
      return 'Title is required';
    if (title.trim().length > 255)
      return 'Title must be 255 characters or less';
  }
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority))
    return `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`;
  if (status !== undefined && !VALID_STATUSES.includes(status))
    return `Status must be one of: ${VALID_STATUSES.join(', ')}`;
  if (due_date !== undefined && due_date !== null && !/^\d{4}-\d{2}-\d{2}$/.test(due_date))
    return 'due_date must be in YYYY-MM-DD format';
  return null;
}

function getTasks(filters) {
  const tasks = repo.findAll(filters);
  return tasks.map(t => ({ ...t, labels: repo.getLabels(t.id) }));
}

function getTask(id) {
  const task = repo.findById(id);
  if (!task) return null;
  return { ...task, labels: repo.getLabels(id) };
}

function createTask(data) {
  const error = validate(data);
  if (error) throw Object.assign(new Error(error), { status: 400 });
  if (!data.title) throw Object.assign(new Error('Title is required'), { status: 400 });
  data.title = data.title.trim();
  return repo.create(data);
}

function updateTask(id, data) {
  const existing = repo.findById(id);
  if (!existing) return null;
  const error = validate(data);
  if (error) throw Object.assign(new Error(error), { status: 400 });
  if (data.title) data.title = data.title.trim();
  return repo.update(id, data);
}

function deleteTask(id) {
  const existing = repo.findById(id);
  if (!existing) return false;
  repo.remove(id);
  return true;
}

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
