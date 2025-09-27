# V-call Architecture Documentation

## 📋 Overview

V-call is a WebRTC-based video calling application built with a simple client-server architecture. The current implementation focuses on local media capture with plans for peer-to-peer communication.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    V-call Application                        │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Browser)          │  Backend (Node.js)           │
│  ┌─────────────────────────┐ │  ┌─────────────────────────┐ │
│  │     index.html          │ │  │      app.js             │ │
│  │  - UI Components        │ │  │  - Express Server       │ │
│  │  - Bootstrap Layout     │ │  │  - Static File Serving  │ │
│  │  - Room Interface       │ │  │  - Port: 3000          │ │
│  └─────────────────────────┘ │  └─────────────────────────┘ │
│  ┌─────────────────────────┐ │                              │
│  │     main.js             │ │  📋 Planned:                 │
│  │  - WebRTC Logic         │ │  ┌─────────────────────────┐ │
│  │  - Media Capture        │ │  │  WebSocket Server       │ │
│  │  - UI Event Handlers    │ │  │  - Signaling Service    │ │
│  │  - ICE Configuration    │ │  │  - Room Management      │ │
│  └─────────────────────────┘ │  └─────────────────────────┘ │
│  ┌─────────────────────────┐ │                              │
│  │     index.css           │ │                              │
│  │  - Custom Styles        │ │                              │
│  │  - Video Layout         │ │                              │
│  │  - Responsive Design    │ │                              │
│  └─────────────────────────┘ │                              │
└─────────────────────────────────────────────────────────────┘
```

## 📁 File Structure Analysis

### Backend Components

#### `app.js` - Express Server
```javascript
Purpose: HTTP server and static file serving
Current Implementation:
- Creates Express application
- Serves static files from /public
- Listens on port 3000 (or environment PORT)
- Minimal configuration

Missing:
- WebSocket server for signaling
- Room management endpoints
- User session handling
```

#### `package.json` - Dependencies
```json
Current Dependencies:
- express: ^4.18.2 (Web framework)

Planned Dependencies:
- socket.io: WebSocket communication
- uuid: Room/session ID generation
- cors: Cross-origin resource sharing
```

### Frontend Components

#### `index.html` - User Interface
```html
Structure:
├── Navigation Bar (Bootstrap)
├── Room Selection Interface
│   ├── Room Name Input
│   └── "Go to Room" Button
├── Video Call Interface (Initially Hidden)
│   ├── Local Video Element
│   ├── Remote Video Element
│   └── Media Control Buttons
└── External Dependencies
    ├── Bootstrap CSS/JS
    ├── Font Awesome Icons
    └── Popper.js
```

#### `main.js` - Client Logic
```javascript
Current Implementation:
├── DOM Element References
├── WebRTC Configuration
│   ├── ICE Servers (STUN)
│   └── Media Constraints
├── Room Entry Logic
├── Media Capture Function
└── UI State Management

Issues:
├── Syntax Error: addEventListener.getElementById()
├── Incomplete WebRTC Implementation
├── Missing Signaling Logic
└── Non-functional Media Controls
```

#### `index.css` - Styling
```css
Styles:
├── Navigation Bar Styling
├── Button Customization
├── Video Element Layout
│   ├── Black Background
│   ├── Rounded Borders
│   ├── Shadow Effects
│   └── Responsive Dimensions
└── Color Scheme: Teal/Beige Theme
```

## 🔄 Current Data Flow

### 1. Application Initialization
```
User Request → Express Server → index.html → Load CSS/JS → UI Ready
```

### 2. Room Entry Process
```
User Input → Room Name → Click Button → getUserMedia() → Local Video Display
```

### 3. Media Capture Flow
```
Browser API → Camera/Microphone Access → Stream Object → Video Element
```

## 🎯 WebRTC Implementation Plan

### Current State
```javascript
// Implemented
const iceServers = {
    'iceServer': [
        { 'urls': 'stun:stun.services.mozilla.com' },
        { 'urls': 'stun:stun.l.google.com:19302' }
    ]
};

// Missing
- RTCPeerConnection creation
- Signaling server communication
- Offer/Answer exchange
- ICE candidate handling
- Remote stream management
```

### Planned WebRTC Flow
```
┌─────────────────────────────────────────────────────────────┐
│                WebRTC Connection Process                    │
├─────────────────────────────────────────────────────────────┤
│  User A                │  Signaling Server │  User B        │
│  ┌─────────────────┐   │  ┌─────────────┐  │  ┌───────────┐ │
│  │1. Create Offer  │──→│  │2. Relay     │──→│  │3. Receive │ │
│  │4. Add ICE       │←──│  │   Messages  │←──│  │   Offer   │ │
│  │   Candidates    │   │  │5. Room Mgmt │  │  │6. Create  │ │
│  │7. Connect P2P   │←─────────────────────────→│   Answer  │ │
│  └─────────────────┘   │  └─────────────┘  │  └───────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🧩 Component Responsibilities

### Frontend Responsibilities
- **UI Management**: Room interface, video display, controls
- **Media Handling**: Camera/microphone access and display
- **WebRTC Client**: Peer connection management
- **Event Handling**: User interactions and state changes

### Backend Responsibilities (Planned)
- **Static Serving**: HTML, CSS, JS file delivery
- **Signaling**: WebSocket server for peer communication
- **Room Management**: Create, join, leave room operations
- **Session Handling**: User connections and state tracking

## 🔧 Technical Configuration

### ICE Servers
```javascript
Current STUN Servers:
- Mozilla: stun:stun.services.mozilla.com
- Google: stun:stun.l.google.com:19302

Purpose: NAT traversal for peer connections
```

### Media Constraints
```javascript
Current Configuration:
{
    audio: true,    // Microphone access
    video: true     // Camera access
}

Planned Enhancements:
- Video resolution options
- Audio processing settings
- Device selection
- Quality adaptation
```

### Browser Compatibility
```
Supported Browsers:
✅ Chrome/Chromium (recommended)
✅ Firefox
✅ Safari (WebKit)
✅ Edge (Chromium-based)

WebRTC API Support:
- getUserMedia() ✅
- RTCPeerConnection (planned)
- WebSocket/Socket.IO (planned)
```

## 🚨 Current Limitations

### Code Issues
1. **JavaScript Syntax Error**: `addEventListener.getElementById()` is invalid
2. **Incomplete Functions**: Media control handlers not implemented
3. **Missing Error Handling**: No validation or fallback mechanisms

### Architecture Gaps
1. **No Signaling**: Cannot establish peer connections
2. **No Room Logic**: Users can't actually connect to rooms
3. **State Management**: No session or connection state tracking
4. **Security**: No authentication or room protection

### Scalability Concerns
1. **Single Server**: No load balancing or clustering
2. **Memory Management**: No session cleanup
3. **Resource Usage**: No connection limits or optimization

## 🚀 Enhancement Roadmap

### Phase 1: Fix Current Issues
- Resolve JavaScript syntax errors
- Implement basic media controls
- Add error handling and validation

### Phase 2: WebRTC Implementation
- Add Socket.IO for signaling
- Implement RTCPeerConnection
- Create offer/answer exchange logic
- Handle ICE candidate exchange

### Phase 3: Room Management
- Multi-user room support
- Room creation and joining
- User presence indication
- Connection state management

### Phase 4: Advanced Features
- Screen sharing
- Text chat
- Recording capabilities
- Mobile optimization

---

This architecture provides a foundation for a scalable WebRTC video calling application while maintaining simplicity and clarity in the codebase.