// server/server.js
const express = require('express');
const cors = require('cors');
const db = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001; // Puerto diferente al de React
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambiame'; // ¡Cambia esto y ponlo en .env!

// Middleware
app.use(cors()); // Permite peticiones del frontend (React)
app.use(express.json()); // Permite leer JSON en el body de las peticiones

// --- Middleware de Autenticación ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.sendStatus(401); // Si no hay token, no autorizado

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error("JWT Verification Error:", err);
            return res.sendStatus(403); // Token inválido o expirado
        }
        req.user = user; // Guarda la info del usuario decodificada en la request
        next(); // Pasa al siguiente middleware o ruta
    });
};

// --- RUTAS DE AUTENTICACIÓN ---

// Registro de Usuario
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const sql = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
        db.run(sql, [username, email, hashedPassword], function (err) {
            if (err) {
                // Manejar error de usuario/email duplicado (SQLite error code SQLITE_CONSTRAINT)
                if (err.errno === 19) { // Código específico de SQLite para violación de constraint UNIQUE
                   return res.status(409).json({ message: 'Username or email already exists.' });
                }
                console.error('Database error during registration:', err.message);
                return res.status(500).json({ message: 'Error registering user' });
            }
            res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
        });
    } catch (error) {
        console.error('Hashing error:', error);
        res.status(500).json({ message: 'Error processing registration' });
    }
});

// Login de Usuario
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], async (err, user) => {
        if (err) {
            console.error('Database error during login:', err.message);
            return res.status(500).json({ message: 'Error logging in' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' }); // Usuario no encontrado
        }

        try {
            // Comparar contraseña enviada con la hasheada en la BD
            const match = await bcrypt.compare(password, user.password_hash);
            if (match) {
                // Contraseña correcta: Generar JWT
                const payload = { id: user.id, username: user.username, email: user.email };
                const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expira en 1 hora

                res.json({ message: 'Login successful', token, user: {id: user.id, username: user.username, email: user.email} });
            } else {
                // Contraseña incorrecta
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (compareError) {
            console.error('Password comparison error:', compareError);
            res.status(500).json({ message: 'Error processing login' });
        }
    });
});

// --- RUTAS CRUD DE USUARIOS (Protegidas) ---

// Obtener todos los usuarios (solo username y email)
app.get('/api/users', authenticateToken, (req, res) => {
    // req.user contiene la info del token verificado
    console.log("User making request:", req.user); // Puedes ver quién hace la petición
    const sql = "SELECT id, username, email, created_at FROM users ORDER BY username";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Error fetching users:", err.message);
            return res.status(500).json({ message: "Error fetching users" });
        }
        res.json(rows);
    });
});

// Obtener un usuario específico (solo username y email)
app.get('/api/users/:id', authenticateToken, (req, res) => {
    const sql = "SELECT id, username, email, created_at FROM users WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
             console.error("Error fetching user:", err.message);
            return res.status(500).json({ message: "Error fetching user" });
        }
        if (!row) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(row);
    });
});

// Actualizar un usuario (ej: solo se permite actualizar email o username, no contraseña aquí)
app.put('/api/users/:id', authenticateToken, (req, res) => {
    const { username, email } = req.body;
    const { id } = req.params;

    // Validar que el usuario que edita es el mismo (o un admin, lógica no implementada aquí)
    // if (req.user.id !== parseInt(id)) {
    //     return res.status(403).json({ message: "Forbidden: You can only update your own profile." });
    // }

    if (!username || !email) {
        return res.status(400).json({ message: 'Username and email are required for update' });
    }

    const sql = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
    db.run(sql, [username, email, id], function (err) {
        if (err) {
             if (err.errno === 19) { // Código específico de SQLite para violación de constraint UNIQUE
                   return res.status(409).json({ message: 'Username or email already exists.' });
             }
            console.error("Error updating user:", err.message);
            return res.status(500).json({ message: "Error updating user" });
        }
        if (this.changes === 0) {
             return res.status(404).json({ message: "User not found or no changes made" });
        }
        res.json({ message: 'User updated successfully' });
    });
});

// Eliminar un usuario
app.delete('/api/users/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

     // Opcional: Añadir lógica de permisos (solo admin puede borrar, o solo el propio usuario)
    // if (req.user.id !== parseInt(id) /* && !req.user.isAdmin */) {
    //    return res.status(403).json({ message: "Forbidden: You cannot delete this user." });
    // }

    const sql = 'DELETE FROM users WHERE id = ?';
    db.run(sql, [id], function (err) {
        if (err) {
            console.error("Error deleting user:", err.message);
            return res.status(500).json({ message: "Error deleting user" });
        }
         if (this.changes === 0) {
             return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: 'User deleted successfully' });
    });
});


// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});