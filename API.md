# V-call API Documentation

## 📡 API Overview

V-call currently uses a minimal HTTP server for static file serving. This document outlines the current endpoints and the planned WebSocket API for real-time communication.

## 🌐 HTTP Endpoints

### Current Implementation

#### Static File Server
```
GET / 
GET /index.html
```
- **Description**: Serves the main application interface
- **Response**: HTML page with video calling interface
- **Status**: ✅ Implemented

```
GET /main.js
```
- **Description**: Client-side JavaScript for WebRTC functionality
- **Response**: JavaScript file with media capture logic
- **Status**: ⚠️ Contains errors, needs fixes

```
GET /index.css
```
- **Description**: Application styling and layout
- **Response**: CSS file with responsive design
- **Status**: ✅ Implemented

### Health Check Endpoint (Planned)
```
GET /health
```
- **Description**: Server health status
- **Response**: 
  ```json
  {
    "status": "healthy",
    "timestamp": "2025-09-26T20:30:00Z",
    "uptime": 3600,
    "version": "1.0.0"
  }
  ```
- **Status**: 📋 Planned

## 🔌 WebSocket API (Planned)

### Connection Lifecycle

#### 1. Client Connection
```javascript
// Client connects to WebSocket server
const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('Connected to signaling server');
});
```

#### 2. Room Operations

##### Join Room
**Event**: `join-room`
**Direction**: Client → Server
```javascript
socket.emit('join-room', {
    roomId: 'room-123',
    userId: 'user-456',
    userInfo: {
        name: 'John Doe',
        avatar: 'https://example.com/avatar.jpg'
    }
});
```

**Response**: `room-joined`
**Direction**: Server → Client
```javascript
socket.on('room-joined', (data) => {
    // data = {
    //     roomId: 'room-123',
    //     participants: ['user-456', 'user-789'],
    //     success: true
    // }
});
```

##### Leave Room
**Event**: `leave-room`
**Direction**: Client → Server
```javascript
socket.emit('leave-room', {
    roomId: 'room-123',
    userId: 'user-456'
});
```

#### 3. WebRTC Signaling

##### Offer Exchange
**Event**: `offer`
**Direction**: Client A → Server → Client B
```javascript
// Client A sends offer
socket.emit('offer', {
    roomId: 'room-123',
    targetUserId: 'user-789',
    offer: rtcOffer,
    fromUserId: 'user-456'
});

// Client B receives offer
socket.on('offer', async (data) => {
    const { offer, fromUserId, roomId } = data;
    await peerConnection.setRemoteDescription(offer);
    // Create answer...
});
```

##### Answer Exchange
**Event**: `answer`
**Direction**: Client B → Server → Client A
```javascript
// Client B sends answer
socket.emit('answer', {
    roomId: 'room-123',
    targetUserId: 'user-456',
    answer: rtcAnswer,
    fromUserId: 'user-789'
});

// Client A receives answer
socket.on('answer', async (data) => {
    const { answer, fromUserId } = data;
    await peerConnection.setRemoteDescription(answer);
});
```

##### ICE Candidate Exchange
**Event**: `ice-candidate`
**Direction**: Bidirectional
```javascript
// Send ICE candidate
socket.emit('ice-candidate', {
    roomId: 'room-123',
    targetUserId: 'user-789',
    candidate: iceCandidate,
    fromUserId: 'user-456'
});

// Receive ICE candidate
socket.on('ice-candidate', async (data) => {
    const { candidate, fromUserId } = data;
    await peerConnection.addIceCandidate(candidate);
});
```

#### 4. Room Management Events

##### User Joined
**Event**: `user-joined`
**Direction**: Server → All Clients in Room
```javascript
socket.on('user-joined', (data) => {
    // data = {
    //     roomId: 'room-123',
    //     userId: 'user-999',
    //     userInfo: { name: 'Jane Doe' },
    //     participantCount: 3
    // }
});
```

##### User Left
**Event**: `user-left`
**Direction**: Server → All Clients in Room
```javascript
socket.on('user-left', (data) => {
    // data = {
    //     roomId: 'room-123',
    //     userId: 'user-789',
    //     participantCount: 2
    // }
});
```

## 📋 Data Models

### Room Object
```javascript
{
    id: 'room-123',
    name: 'My Video Call',
    participants: [
        {
            userId: 'user-456',
            socketId: 'socket-abc123',
            joined: '2025-09-26T20:30:00Z',
            userInfo: {
                name: 'John Doe',
                avatar: 'https://example.com/avatar.jpg'
            }
        }
    ],
    created: '2025-09-26T20:25:00Z',
    maxParticipants: 8,
    isPrivate: false,
    password: null
}
```

### User Object
```javascript
{
    userId: 'user-456',
    socketId: 'socket-abc123',
    currentRoom: 'room-123',
    userInfo: {
        name: 'John Doe',
        avatar: 'https://example.com/avatar.jpg',
        mediaSettings: {
            audio: true,
            video: true,
            screen: false
        }
    },
    connectionState: 'connected', // 'connecting' | 'connected' | 'disconnected'
    joinedAt: '2025-09-26T20:30:00Z'
}
```

### WebRTC Session Description
```javascript
{
    type: 'offer' | 'answer',
    sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\n...',
    roomId: 'room-123',
    fromUserId: 'user-456',
    targetUserId: 'user-789',
    timestamp: '2025-09-26T20:30:00Z'
}
```

### ICE Candidate
```javascript
{
    candidate: 'candidate:842163049 1 udp 1677729535 192.168.1.100 54400 typ srflx...',
    sdpMLineIndex: 0,
    sdpMid: '0',
    roomId: 'room-123',
    fromUserId: 'user-456',
    targetUserId: 'user-789'
}
```

## 🛡️ Error Handling

### WebSocket Error Events

#### Connection Errors
```javascript
socket.on('connect_error', (error) => {
    console.error('Connection failed:', error);
    // Handle reconnection logic
});
```

#### Room Errors
```javascript
socket.on('room-error', (data) => {
    // data = {
    //     error: 'ROOM_FULL' | 'ROOM_NOT_FOUND' | 'INVALID_PASSWORD',
    //     message: 'Room has reached maximum capacity',
    //     roomId: 'room-123'
    // }
});
```

#### WebRTC Errors
```javascript
socket.on('webrtc-error', (data) => {
    // data = {
    //     error: 'OFFER_FAILED' | 'ANSWER_FAILED' | 'ICE_FAILED',
    //     message: 'Failed to create WebRTC offer',
    //     details: {...}
    // }
});
```

## 🔒 Authentication & Security

### Room Security (Planned)

#### Password-Protected Rooms
```javascript
socket.emit('join-room', {
    roomId: 'private-room-123',
    userId: 'user-456',
    password: 'room-secret-password'
});
```

#### Token-Based Authentication
```javascript
socket.emit('authenticate', {
    token: 'jwt-token-here',
    userId: 'user-456'
});

socket.on('authenticated', (data) => {
    // data = { success: true, user: {...} }
});
```

## 📊 Rate Limiting

### Connection Limits (Planned)
- Max 10 connections per IP per minute
- Max 5 room joins per user per minute
- Max 100 signaling messages per minute per connection

### Implementation
```javascript
const rateLimit = {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP'
};
```

## 🧪 Testing Examples

### Testing WebSocket Connection
```javascript
// Connect to server
const socket = io('http://localhost:3000');

// Test room joining
socket.emit('join-room', {
    roomId: 'test-room',
    userId: 'test-user'
});

// Listen for responses
socket.on('room-joined', (data) => {
    console.log('Successfully joined room:', data);
});
```

### Testing WebRTC Signaling
```javascript
// Mock WebRTC offer
const mockOffer = {
    type: 'offer',
    sdp: 'mock-sdp-string'
};

// Send offer through signaling
socket.emit('offer', {
    roomId: 'test-room',
    targetUserId: 'other-user',
    offer: mockOffer,
    fromUserId: 'test-user'
});
```

## 📈 Performance Monitoring

### Metrics to Track (Planned)
- Connection establishment time
- WebRTC offer/answer exchange latency
- ICE candidate gathering time
- Room join/leave frequency
- Concurrent active connections

### Health Check Response
```javascript
GET /health
{
    "status": "healthy",
    "metrics": {
        "activeConnections": 45,
        "activeRooms": 12,
        "totalUsers": 67,
        "avgConnectionTime": "1.2s",
        "uptime": "2h 15m"
    },
    "lastUpdated": "2025-09-26T20:30:00Z"
}
```

---

## 🚀 Implementation Status

### ✅ Completed
- Basic HTTP server for static files
- File serving endpoints

### 🚧 In Progress
- WebSocket server setup
- Signaling protocol design

### 📋 Planned
- Complete WebSocket API
- Authentication system
- Rate limiting
- Health monitoring
- Error handling

This API documentation will be updated as the WebSocket signaling server and additional features are implemented.