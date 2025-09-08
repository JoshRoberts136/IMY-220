const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/login', (req, res) => {
});

app.post('/api/signup', (req, res) => {
});
