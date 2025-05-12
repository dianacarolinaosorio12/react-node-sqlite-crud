// server/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, 'users_app.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Crear tabla users si no existe (con password_hash)
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, async (err) => {
            if (err) {
                console.error('Error creating users table:', err.message);
            } else {
                console.log('Table "users" is ready.');
                // Opcional: Insertar un usuario admin inicial si la tabla está vacía
                db.get("SELECT COUNT(*) as count FROM users", async (err, row) => {
                    if (row.count === 0) {
                        try {
                            const saltRounds = 10;
                            const adminPassword = 'adminpassword'; // ¡Cambia esto!
                            const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
                            db.run("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
                                ['admin', 'admin@example.com', hashedPassword],
                                (err) => {
                                    if(err) console.error("Error inserting admin user:", err.message);
                                    else console.log("Admin user created.");
                                }
                            );
                        } catch (hashError) {
                            console.error("Error hashing admin password:", hashError);
                        }
                    }
                });
            }
        });
    }
});

module.exports = db;