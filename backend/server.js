// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Enable CORS for all origins so any test website can connect
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`[+] Supporter/Client connected: ${socket.id}`);

    // Listen for messages from the widget
    socket.on('send_message', (data) => {
        console.log(`Message received: ${data.text}`);
        
        // In a real production app, you would route this to a specific supporter.
        // For testing, we will echo an automated response back to the client.
        setTimeout(() => {
            socket.emit('receive_message', { 
                sender: 'Support Agent', 
                text: `We received: "${data.text}". How can we help you today?` 
            });
        }, 1000);
    });

    socket.on('disconnect', () => {
        console.log(`[-] Disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Socket backend running on http://localhost:${PORT}`);
});