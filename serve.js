const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 5000;

// Serve static files from html_version directory
app.use(express.static(path.join(__dirname, 'html_version')));

// Redirect root to the html version
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`HTML version server running at http://0.0.0.0:${PORT}`);
});
