const express = require('express');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 3000;

// Store active rooms and users
const rooms = new Map();
const users = new Map();

// Serve static files
app.use(express.static('public'));

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle joining a room
    socket.on('join-room', (data) => {
        const { roomId, userId } = data;
        
        // Leave previous room if any
        if (users.has(socket.id)) {
            const prevRoom = users.get(socket.id).roomId;
            socket.leave(prevRoom);
            removeUserFromRoom(prevRoom, socket.id);
        }

        // Join new room
        socket.join(roomId);
        
        // Initialize room if it doesn't exist
        if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
        }
        
        // Add user to room
        rooms.get(roomId).add(socket.id);
        users.set(socket.id, { roomId, userId });
        
        // Get other users in room
        const otherUsers = Array.from(rooms.get(roomId)).filter(id => id !== socket.id);
        
        console.log(`User ${userId} joined room ${roomId}. Users in room: ${rooms.get(roomId).size}`);
        
        // Notify the user about successful join and other users
        socket.emit('room-joined', { 
            roomId, 
            users: otherUsers,
            success: true 
        });
        
        // Notify other users in the room about new user
        socket.to(roomId).emit('user-joined', { 
            userId: socket.id, 
            roomId 
        });
    });

    // Handle WebRTC offer
    socket.on('offer', (data) => {
        const { targetUserId, offer, roomId } = data;
        console.log(`Relaying offer from ${socket.id} to ${targetUserId}`);
        socket.to(targetUserId).emit('offer', {
            offer,
            fromUserId: socket.id,
            roomId
        });
    });

    // Handle WebRTC answer
    socket.on('answer', (data) => {
        const { targetUserId, answer, roomId } = data;
        console.log(`Relaying answer from ${socket.id} to ${targetUserId}`);
        socket.to(targetUserId).emit('answer', {
            answer,
            fromUserId: socket.id,
            roomId
        });
    });

    // Handle ICE candidates
    socket.on('ice-candidate', (data) => {
        const { targetUserId, candidate, roomId } = data;
        socket.to(targetUserId).emit('ice-candidate', {
            candidate,
            fromUserId: socket.id,
            roomId
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        
        if (users.has(socket.id)) {
            const { roomId } = users.get(socket.id);
            removeUserFromRoom(roomId, socket.id);
            users.delete(socket.id);
            
            // Notify other users in room
            socket.to(roomId).emit('user-left', { 
                userId: socket.id, 
                roomId 
            });
        }
    });
});

// Helper function to remove user from room
function removeUserFromRoom(roomId, socketId) {
    if (rooms.has(roomId)) {
        rooms.get(roomId).delete(socketId);
        if (rooms.get(roomId).size === 0) {
            rooms.delete(roomId);
        }
    }
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        activeRooms: rooms.size,
        totalUsers: users.size,
        timestamp: new Date().toISOString()
    });
});

server.listen(port, () => {
    console.log(`🚀 V-call server running on port ${port}`);
    console.log(`📱 Open http://localhost:${port} in your browser`);
});