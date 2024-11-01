require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3100;

app.use(cors());
app.use(express.json());  // Para parsear JSON en solicitudes
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));
let urlDatabase = {};
let urlId = 1;
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;

  try {
    const hostname = new URL(url).hostname;

    dns.lookup(hostname, (err, address) => {
      if (err) {
        return res.json({ error: 'invalid url' });
      }

      urlDatabase[urlId] = url;
      res.json({ original_url: url, short_url: urlId });
      urlId++;
    });
  } catch (err) {
    res.json({ error: 'invalid url' });
  }
});

// Ruta para redireccionar URLs acortadas
app.get('/api/shorturl/:id', (req, res) => {
  const { id } = req.params;
  const originalUrl = urlDatabase[id];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});