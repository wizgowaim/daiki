const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// 📦 IMPORTANT : stockage persistant Railway
const dbPath = path.join(process.cwd(), "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("❌ DB error:", err);
  else console.log("✅ SQLite connecté");
});

// 🧱 création table
db.run(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    tag TEXT
  )
`);

module.exports = db;
