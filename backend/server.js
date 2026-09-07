import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Generera engångslösenord
function generateOTP() {
    // Generera en sexsiffrig numerisk OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}

// Arrayer
const users = [];
const accounts = [];
const sessions = [];

// Skapa användare
app.post('/users', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Användarnamn och lösenord krävs' });
    }

    const newUser = {
        id: users.length + 1,
        username,
        password
    };
    users.push(newUser);

    const newAccount = {
        id: accounts.length + 1,
        userId: newUser.id,
        amount: 0
    };
    accounts.push(newAccount);

    res.status(201).json(newUser);
});

// Logga in
app.post('/sessions', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (!user) {
        return res.status(401).json({ error: 'Fel användarnamn eller lösenord' });
    }

    const token = generateOTP();
    sessions.push({ userId: user.id, token });

    res.status(200).json({ token });
});

// Visa saldo
app.post('/me/accounts', (req, res) => {
    const { token } = req.body;

    const session = sessions.find((s) => s.token === token);

    if (!session) {
        return res.status(401).json({ error: 'Ogiltig token' });
    }

    const account = accounts.find((a) => a.userId === session.userId);

    if (!account) {
        return res.status(404).json({ error: 'Konto hittades inte' });
    }

    res.status(200).json({ amount: account.amount });
});

// Sätt in pengar
app.post('/me/accounts/transactions', (req, res) => {
    const { token, amount } = req.body;

    const session = sessions.find((s) => s.token === token);

    if (!session) {
        return res.status(401).json({ error: 'Ogiltig token' });
    }

    const account = accounts.find((a) => a.userId === session.userId);

    if (!account) {
        return res.status(404).json({ error: 'Konto hittades inte' });
    }

    account.amount += amount;

    res.status(200).json({ amount: account.amount });
});

// Starta servern
app.listen(port, () => {
    console.log(`Bankens backend körs på http://localhost:${port}`);
});