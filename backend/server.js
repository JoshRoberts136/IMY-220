const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../public')));

// Handle API routes (e.g., login, signup) - keep your original logic here
app.post('/api/login', (req, res) => {
  // Your original login logic
});

app.post('/api/signup', (req, res) => {
  // Your original signup logic
});

// Catch-all route to serve index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});