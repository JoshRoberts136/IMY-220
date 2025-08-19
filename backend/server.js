const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '../frontend/public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend/public/index.html')));

app.listen(3000, () => console.log('Server running on port 3000'));