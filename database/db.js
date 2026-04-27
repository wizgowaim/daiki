const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("/data/database.sqlite", (err) => {
  if (err) console.error(err);
  else console.log("✅ SQLite connecté");
});

db.run(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    tag TEXT
  )
`);

module.exports = db;
