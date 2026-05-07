const { getDb } = require('../db/database');

function findAll({ search, priority, status, label } = {}) {
  const db = getDb();
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push('(t.title LIKE ? OR t.description LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (priority) {
    conditions.push('t.priority = ?');
    params.push(priority);
  }
  if (status) {
    conditions.push('t.status = ?');
    params.push(status);
  }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  if (label) {
    const sql = `
      SELECT DISTINCT t.*
      FROM tasks t
      JOIN task_labels tl ON tl.task_id = t.id
      JOIN labels l ON l.id = tl.label_id
      ${where ? where + ' AND' : 'WHERE'} l.name = ?
      ORDER BY t.created_at DESC
    `;
    return db.prepare(sql).all(...params, label);
  }

  const sql = `SELECT * FROM tasks t ${where} ORDER BY t.created_at DESC`;
  return db.prepare(sql).all(...params);
}

function findById(id) {
  return getDb().prepare('SELECT * FROM tasks WHERE id = ?').get(id);
}

function create({ title, description = '', status = 'pending', priority = 'medium', due_date = null }) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO tasks (title, description, status, priority, due_date)
    VALUES (?, ?, ?, ?, ?)
  `).run(title, description, status, priority, due_date);
  return findById(result.lastInsertRowid);
}

function update(id, { title, description, status, priority, due_date }) {
  const db = getDb();
  const fields = [];
  const params = [];

  if (title       !== undefined) { fields.push('title = ?');       params.push(title); }
  if (description !== undefined) { fields.push('description = ?'); params.push(description); }
  if (status      !== undefined) { fields.push('status = ?');      params.push(status); }
  if (priority    !== undefined) { fields.push('priority = ?');    params.push(priority); }
  if (due_date    !== undefined) { fields.push('due_date = ?');    params.push(due_date); }

  if (fields.length === 0) return findById(id);

  fields.push("updated_at = datetime('now')");
  params.push(id);

  db.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`).run(...params);
  return findById(id);
}

function remove(id) {
  return getDb().prepare('DELETE FROM tasks WHERE id = ?').run(id);
}

function getLabels(taskId) {
  return getDb().prepare(`
    SELECT l.* FROM labels l
    JOIN task_labels tl ON tl.label_id = l.id
    WHERE tl.task_id = ?
  `).all(taskId);
}

module.exports = { findAll, findById, create, update, remove, getLabels };
