const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite Database
const db = new sqlite3.Database(path.join(__dirname, 'data', 'database.sqlite'), (err) => {
    if (err) console.error("Database opening error: ", err);
    else console.log("Connected to SQLite database.");
});

// Create Table if it doesn't exist (Now includes 'hours')
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS shifts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        status TEXT,
        type TEXT,
        date TEXT,
        start TEXT,
        end TEXT,
        isBreak INTEGER,
        hours REAL
    )`);

    // Safe migration: Add 'hours' column to existing V4 databases if it's missing
    db.run(`ALTER TABLE shifts ADD COLUMN hours REAL`, (err) => {
        // We ignore the error here because it will safely fail if the column already exists
    });
});

// API ROUTE: Get all shifts
app.get('/api/shifts', (req, res) => {
    db.all("SELECT * FROM shifts", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const formattedRows = rows.map(r => ({ ...r, isBreak: r.isBreak === 1 }));
        res.json(formattedRows);
    });
});

// API ROUTE: Create a new shift
app.post('/api/shifts', (req, res) => {
    const { status, type, date, start, end, isBreak, hours } = req.body;
    const isBreakInt = isBreak ? 1 : 0;
    
    db.run(`INSERT INTO shifts (status, type, date, start, end, isBreak, hours) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [status, type, date, start, end, isBreakInt, hours], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        });
});

// API ROUTE: Update a shift
app.put('/api/shifts/:id', (req, res) => {
    const { status, type, date, start, end, isBreak, hours } = req.body;
    const isBreakInt = isBreak ? 1 : 0;

    db.run(`UPDATE shifts SET status=?, type=?, date=?, start=?, end=?, isBreak=?, hours=? WHERE id=?`,
        [status, type, date, start, end, isBreakInt, hours, req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        });
});

// API ROUTE: Delete a shift
app.delete('/api/shifts/:id', (req, res) => {
    db.run(`DELETE FROM shifts WHERE id=?`, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

// API ROUTE: Delete ALL shifts (Nuke Database)
app.delete('/api/shifts', (req, res) => {
    db.run(`DELETE FROM shifts`, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        // Reset the auto-increment counter so IDs start at 1 again
        db.run(`DELETE FROM sqlite_sequence WHERE name='shifts'`);
        res.json({ deleted: this.changes });
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));