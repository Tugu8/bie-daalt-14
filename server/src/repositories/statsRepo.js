const { getDb } = require('../db/database');

function getSummary() {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);
  return {
    total:    db.prepare('SELECT COUNT(*) as n FROM tasks').get().n,
    done:     db.prepare("SELECT COUNT(*) as n FROM tasks WHERE status = 'done'").get().n,
    pending:  db.prepare("SELECT COUNT(*) as n FROM tasks WHERE status = 'pending'").get().n,
    overdue:  db.prepare(
      "SELECT COUNT(*) as n FROM tasks WHERE status = 'pending' AND due_date < ?"
    ).get(today).n,
    by_priority: {
      high:   db.prepare("SELECT COUNT(*) as n FROM tasks WHERE priority = 'high'").get().n,
      medium: db.prepare("SELECT COUNT(*) as n FROM tasks WHERE priority = 'medium'").get().n,
      low:    db.prepare("SELECT COUNT(*) as n FROM tasks WHERE priority = 'low'").get().n,
    }
  };
}

module.exports = { getSummary };
