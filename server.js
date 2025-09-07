const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// API routes placeholder
app.use('/api', (req, res) => {
    res.json({ 
        message: 'ISP Management API - Coming Soon',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '1.0.0'
    });
});

// Handle client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 ISP Management System running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🌐 Web interface: http://localhost:${PORT}`);
});
