import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pool from './db.js';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Generera engångslösenord
function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}

// Skapa användare
app.post('/users', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Användarnamn och lösenord krävs' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password]
        );

        const userId = result.insertId;

        await pool.query(
            'INSERT INTO accounts (userId, amount) VALUES (?, 0)',
            [userId]
        );

        res.status(201).json({ id: userId, username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Något gick fel' });
    }
});

// Logga in
app.post('/sessions', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Fel användarnamn eller lösenord' });
        }

        const user = rows[0];
        const token = generateOTP();

        await pool.query(
            'INSERT INTO sessions (userId, token) VALUES (?, ?)',
            [user.id, token]
        );

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Något gick fel' });
    }
});

// Visa saldo
app.post('/me/accounts', async (req, res) => {
    const { token } = req.body;

    try {
        const [sessionRows] = await pool.query(
            'SELECT * FROM sessions WHERE token = ?',
            [token]
        );

        if (sessionRows.length === 0) {
            return res.status(401).json({ error: 'Ogiltig token' });
        }

        const session = sessionRows[0];

        const [accountRows] = await pool.query(
            'SELECT * FROM accounts WHERE userId = ?',
            [session.userId]
        );

        if (accountRows.length === 0) {
            return res.status(404).json({ error: 'Konto hittades inte' });
        }

        res.status(200).json({ amount: accountRows[0].amount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Något gick fel' });
    }
});

// Sätt in pengar
app.post('/me/accounts/transactions', async (req, res) => {
    const { token, amount } = req.body;

    try {
        const [sessionRows] = await pool.query(
            'SELECT * FROM sessions WHERE token = ?',
            [token]
        );

        if (sessionRows.length === 0) {
            return res.status(401).json({ error: 'Ogiltig token' });
        }

        const session = sessionRows[0];

        const [accountRows] = await pool.query(
            'SELECT * FROM accounts WHERE userId = ?',
            [session.userId]
        );

        if (accountRows.length === 0) {
            return res.status(404).json({ error: 'Konto hittades inte' });
        }

        const newAmount = accountRows[0].amount + amount;

        await pool.query(
            'UPDATE accounts SET amount = ? WHERE userId = ?',
            [newAmount, session.userId]
        );

        res.status(200).json({ amount: newAmount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Något gick fel' });
    }
});

// Starta servern
app.listen(port, () => {
    console.log(`Bankens backend körs på http://localhost:${port}`);
});