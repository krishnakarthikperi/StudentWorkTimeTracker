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

// Initialize SQLite Database (Stored in the /data folder for Docker persistence)
const db = new sqlite3.Database(path.join(__dirname, 'data', 'database.sqlite'), (err) => {
    if (err) console.error("Database opening error: ", err);
    else console.log("Connected to SQLite database.");
});

// Create Table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS shifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT,
    type TEXT,
    date TEXT,
    start TEXT,
    end TEXT,
    isBreak INTEGER
)`);

// API ROUTE: Get all shifts
app.get('/api/shifts', (req, res) => {
    db.all("SELECT * FROM shifts", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // Convert SQLite integer (0/1) back to boolean for the frontend
        const formattedRows = rows.map(r => ({ ...r, isBreak: r.isBreak === 1 }));
        res.json(formattedRows);
    });
});

// API ROUTE: Create a new shift
app.post('/api/shifts', (req, res) => {
    const { status, type, date, start, end, isBreak } = req.body;
    const isBreakInt = isBreak ? 1 : 0;
    
    db.run(`INSERT INTO shifts (status, type, date, start, end, isBreak) VALUES (?, ?, ?, ?, ?, ?)`,
        [status, type, date, start, end, isBreakInt], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        });
});

// API ROUTE: Update a shift
app.put('/api/shifts/:id', (req, res) => {
    const { status, type, date, start, end, isBreak } = req.body;
    const isBreakInt = isBreak ? 1 : 0;

    db.run(`UPDATE shifts SET status=?, type=?, date=?, start=?, end=?, isBreak=? WHERE id=?`,
        [status, type, date, start, end, isBreakInt, req.params.id], function(err) {
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

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));