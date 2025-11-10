const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const http = require('http');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the root directory
app.use(express.static(__dirname));

// API proxy for television endpoints
app.get('/api/television/:endpoint/:email', async (req, res) => {
  try {
    const { endpoint, email } = req.params;
    const url = `http://127.0.0.1:8000/api/television/${endpoint}/${email}`;
    
    console.log(`Proxying request to: ${url}`);
    
    const response = await axios.get(url);
    
    // Forward the response
    res.set('Content-Type', response.headers['content-type']);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Failed to proxy request' });
  }
});

// API proxy for television queries
app.get('/api/television/:endpoint', async (req, res) => {
  try {
    const { endpoint } = req.params;
    const url = `http://127.0.0.1:8000/api/television/${endpoint}${req.url.split(`/api/television/${endpoint}`)[1]}`;
    
    console.log(`Proxying query request to: ${url}`);
    
    const response = await axios.get(url);
    
    // Forward the response
    res.set('Content-Type', response.headers['content-type']);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Failed to proxy request' });
  }
});


    
    // Log for debugging



// Serve the main HTML page for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Create HTTP server
const server = http.createServer(app);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 