const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Always use the users.db inside the server folder
const dbPath = path.join(__dirname, "users.db");

console.log("DATABASE PATH:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});


// ================= USERS TABLE =================

db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`, (err) => {

    if (err) {
        console.error("Error creating users table:", err.message);
    } else {
        console.log("Users table created successfully.");
    }

});

// ================= ADMINS TABLE =================

db.run(`
    CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`, (err) => {

    if (err) {
        console.error("Error creating admins table:", err.message);
    } else {
        console.log("Admins table created successfully.");
    }

});

// ================= DEFAULT ADMIN =================

db.run(`
    INSERT OR IGNORE INTO admins (username, password)
    VALUES (?, ?)
`, ["admin", "admin123"], (err) => {

    if (err) {
        console.error("Error creating default admin:", err.message);
    } else {
        console.log("Default admin account ready.");
    }

});


// ================= EMERGENCY REQUESTS TABLE =================

db.run(`
    CREATE TABLE IF NOT EXISTS emergency_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        disaster_type TEXT NOT NULL,
        location TEXT NOT NULL,
        latitude REAL,
        longitude REAL ,
        people_count INTEGER NOT NULL,
        description TEXT NOT NULL,
        status TEXT DEFAULT 'PENDING',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {

    if (err) {
        console.error(
            "Error creating emergency requests table:",
            err.message
        );
    } else {
        console.log(
            "Emergency requests table created successfully."
        );
    }

});


db.all(
    `PRAGMA table_info(emergency_requests)`,
    (err, columns) => {

        if (err) {
            console.error("Error checking table:", err.message);
            return;
        }

        const columnNames = columns.map(column => column.name);

        // Add latitude if it does not exist
        if (!columnNames.includes("latitude")) {

            db.run(
                `ALTER TABLE emergency_requests ADD COLUMN latitude REAL`,
                (err) => {

                    if (err) {
                        console.error(
                            "Error adding latitude:",
                            err.message
                        );
                    } else {
                        console.log("Latitude column added.");
                    }

                }
            );

        }

        // Add longitude if it does not exist
        if (!columnNames.includes("longitude")) {

            db.run(
                `ALTER TABLE emergency_requests ADD COLUMN longitude REAL`,
                (err) => {

                    if (err) {
                        console.error(
                            "Error adding longitude:",
                            err.message
                        );
                    } else {
                        console.log("Longitude column added.");
                    }

                }
            );

        }

        // Add assigned_team if it does not exist
        if (!columnNames.includes("assigned_team")) {

            db.run(
                `ALTER TABLE emergency_requests ADD COLUMN assigned_team TEXT`,
                (err) => {

                    if (err) {
                        console.error(
                            "Error adding assigned_team:",
                            err.message
                        );
                    } else {
                        console.log("assigned_team column added.");
                    }

                }
            );

        }

    }
);



// Export database connection
module.exports = db;