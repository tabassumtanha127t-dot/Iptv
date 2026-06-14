const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'CORS Proxy Server Running',
        message: 'Use /proxy?url=YOUR_URL to proxy any stream'
    });
});

// Main proxy endpoint
app.get('/proxy', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter required' });
    }

    try {
        // Validate URL
        new URL(url);

        // Fetch the stream
        const response = await axios({
            method: 'GET',
            url: url,
            timeout: 30000,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        // Set response headers
        res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Cache-Control', 'no-cache');

        // Pipe the stream
        response.data.pipe(res);

    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(500).json({ 
            error: 'Failed to fetch stream',
            details: error.message 
        });
    }
});

// Proxy endpoint for M3U8 files
app.get('/m3u8', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter required' });
    }

    try {
        new URL(url);

        const response = await axios({
            method: 'GET',
            url: url,
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        // Replace URLs in M3U8 to proxy them
        let content = response.data;
        const urlBase = url.substring(0, url.lastIndexOf('/'));
        
        // Simple URL replacement - add proxy prefix to relative URLs
        content = content.replace(/^([^#\n][^\n]*\.ts)$/gm, (match) => {
            if (!match.startsWith('http')) {
                return `${urlBase}/${match}`;
            }
            return match;
        });

        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'max-age=10');
        res.send(content);

    } catch (error) {
        console.error('M3U8 error:', error.message);
        res.status(500).json({ error: 'Failed to fetch M3U8' });
    }
});

// OPTIONS endpoint for CORS preflight
app.options('*', cors());

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ CORS Proxy Server running on port ${PORT}`);
});
