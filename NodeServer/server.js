// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql2 = require('mysql2');

const app = express();
const port = 5000;

app.use(bodyParser.json());

const db = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'manager',
  database: 'chat_app_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.get('/api/messages', (req, res) => {
  db.query('SELECT * FROM messages', (err, results) => {
    if (err) {
      console.error('Error fetching messages:', err);
      res.status(500).json({ error: 'Error fetching messages' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/messages', (req, res) => {
  const { user, message } = req.body;
  db.query('INSERT INTO messages (user, message) VALUES (?, ?)', [user, message], (err, result) => {
    if (err) {
      console.error('Error adding message:', err);
      res.status(500).json({ error: 'Error adding message' });
      return;
    }
    res.status(201).json({ message: 'Message added successfully' });
  });
});

app.post('/api/users', (req, res) => {
  const { username } = req.body;
  db.query('INSERT INTO users (username) VALUES (?)', [username], (err, result) => {
    if (err) {
      console.error('Error adding user:', err);
      res.status(500).json({ error: 'Error adding user' });
      return;
    }
    res.status(201).json({ message: 'User added successfully' });
  });
});

app.delete('/api/messages/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM messages WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting message:', err);
      res.status(500).json({ error: 'Error deleting message' });
      return;
    }
    res.json({ message: 'Message deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
