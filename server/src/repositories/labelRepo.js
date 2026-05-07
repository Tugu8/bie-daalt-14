const { getDb } = require('../db/database');

function findAll() {
  return getDb().prepare('SELECT * FROM labels ORDER BY name').all();
}

function findById(id) {
  return getDb().prepare('SELECT * FROM labels WHERE id = ?').get(id);
}

function findByName(name) {
  return getDb().prepare('SELECT * FROM labels WHERE name = ?').get(name);
}

function create({ name, color = '#6366f1' }) {
  const db = getDb();
  const result = db.prepare('INSERT INTO labels (name, color) VALUES (?, ?)').run(name, color);
  return findById(result.lastInsertRowid);
}

function update(id, { name, color }) {
  const db = getDb();
  const fields = [];
  const params = [];
  if (name  !== undefined) { fields.push('name = ?');  params.push(name); }
  if (color !== undefined) { fields.push('color = ?'); params.push(color); }
  if (fields.length === 0) return findById(id);
  params.push(id);
  db.prepare(`UPDATE labels SET ${fields.join(', ')} WHERE id = ?`).run(...params);
  return findById(id);
}

function remove(id) {
  return getDb().prepare('DELETE FROM labels WHERE id = ?').run(id);
}

function addToTask(taskId, labelId) {
  getDb().prepare(
    'INSERT OR IGNORE INTO task_labels (task_id, label_id) VALUES (?, ?)'
  ).run(taskId, labelId);
}

function removeFromTask(taskId, labelId) {
  return getDb().prepare(
    'DELETE FROM task_labels WHERE task_id = ? AND label_id = ?'
  ).run(taskId, labelId);
}

module.exports = { findAll, findById, findByName, create, update, remove, addToTask, removeFromTask };
