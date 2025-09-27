# V-call Development Guide

## 🛠️ Development Setup

### Prerequisites Checklist
- [ ] Node.js v18+ installed
- [ ] npm package manager
- [ ] Git for version control
- [ ] Modern web browser with WebRTC support
- [ ] Code editor (VS Code recommended)

### Environment Setup

#### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/RanjanKhadka012/V-call.git
cd V-call

# Install dependencies
npm install

# Start development server
npm run dev
# OR
node app.js
```

#### 2. Development Tools (Optional)
```bash
# Install nodemon for auto-restart
npm install -g nodemon
nodemon app.js

# Install browser sync for live reload (advanced)
npm install -g browser-sync
browser-sync start --server --files "public/*"
```

#### 3. Browser Dev Tools Setup
1. Open Chrome DevTools (F12)
2. Navigate to **Console** tab for JavaScript debugging
3. Check **Network** tab for WebRTC connections
4. Use **Sources** tab for debugging breakpoints

## 🐛 Known Issues & Fixes

### Critical Issues

#### 1. JavaScript Syntax Error in `main.js`
**Issue**: Line 45 contains invalid code
```javascript
// ❌ BROKEN CODE
addEventListener.getElementById()
```

**Fix**: Remove or replace with proper event listener
```javascript
// ✅ FIXED CODE
// Remove this line entirely, or implement proper media controls:
document.getElementById("mike").addEventListener('click', toggleMicrophone);
document.getElementById("camera").addEventListener('click', toggleCamera);
```

#### 2. Missing WebRTC Peer Connection
**Issue**: No actual video calling capability
**Status**: 🚧 Major feature missing

**Solution Approach**:
```javascript
// Required implementation
let rtcPeerConnection = new RTCPeerConnection(iceServers);
// + Signaling server
// + Offer/Answer exchange
// + ICE candidate handling
```

#### 3. Non-functional Media Controls
**Issue**: Camera and microphone buttons don't work
```html
<!-- ❌ BROKEN HTML -->
<button id="mike" onclick="microphone">
<button id="camera" onclick="camera">
```

**Fix**: Add proper JavaScript functions
```javascript
// ✅ IMPLEMENTATION NEEDED
function toggleMicrophone() {
    // Implementation required
}

function toggleCamera() {
    // Implementation required
}
```

### Minor Issues

#### 4. Incomplete Room Validation
**Issue**: Empty room names are allowed
```javascript
// ❌ WEAK VALIDATION
if (inputRoomNumber.value === '' || null) {
    console.log("Room id invalid")
}
```

**Fix**: Better validation
```javascript
// ✅ IMPROVED VALIDATION
if (!inputRoomNumber.value || inputRoomNumber.value.trim() === '') {
    alert("Please enter a valid room name");
    return;
}
```

#### 5. Missing Error Handling
**Issue**: No fallback for camera/microphone access failures

## 📋 Development Roadmap

### Phase 1: Bug Fixes & Cleanup (Priority: High)
- [ ] Fix JavaScript syntax error in `main.js`
- [ ] Implement media control functions
- [ ] Add proper input validation
- [ ] Improve error handling for getUserMedia()
- [ ] Code cleanup and documentation

### Phase 2: Core WebRTC Implementation (Priority: High)
- [ ] Add Socket.IO for signaling server
- [ ] Implement RTCPeerConnection
- [ ] Create offer/answer exchange
- [ ] Handle ICE candidates
- [ ] Test peer-to-peer connections

### Phase 3: Room Management (Priority: Medium)
- [ ] Multi-user room support
- [ ] Room creation and joining logic
- [ ] User presence indicators
- [ ] Connection state management
- [ ] Room security (passwords)

### Phase 4: Enhanced Features (Priority: Low)
- [ ] Screen sharing capability
- [ ] In-call text chat
- [ ] Recording functionality
- [ ] Mobile responsiveness
- [ ] Connection quality indicators

## 🔧 Development Commands

### Basic Commands
```bash
# Start the application
node app.js

# Development mode with auto-restart
nodemon app.js

# Check for syntax errors
node --check app.js
node --check public/main.js
```

### Testing Commands
```bash
# Test server response
curl http://localhost:3000

# Check if port is in use
netstat -ano | findstr :3000

# Kill process on port 3000 (Windows)
taskkill /PID <PID> /F
```

## 🧪 Testing Guide

### Manual Testing Checklist

#### Server Testing
- [ ] Server starts without errors
- [ ] Static files are served correctly
- [ ] Application loads in browser
- [ ] No console errors on page load

#### Media Testing
- [ ] Camera permission prompt appears
- [ ] Local video stream displays
- [ ] Microphone access is granted
- [ ] Video quality is acceptable

#### UI Testing
- [ ] Room input accepts text
- [ ] "Go to Room" button responds
- [ ] Interface transitions correctly
- [ ] Responsive design works on mobile

### Browser Testing Matrix
| Browser | Version | Status | Notes |
|---------|---------|--------|--------|
| Chrome  | Latest  | ✅ Recommended | Best WebRTC support |
| Firefox | Latest  | ✅ Good | Full compatibility |
| Safari  | Latest  | ⚠️ Limited | WebRTC quirks |
| Edge    | Latest  | ✅ Good | Chromium-based |

## 📝 Code Style Guidelines

### JavaScript Standards
```javascript
// Use const/let instead of var
const roomNumber = document.getElementById("roomNumber");
let localStream;

// Use async/await for promises
async function getUserMedia() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        return stream;
    } catch (error) {
        console.error('Error accessing media devices:', error);
    }
}

// Add proper error handling
function handleError(error) {
    console.error('Application error:', error);
    // User-friendly error messages
}
```

### HTML Best Practices
```html
<!-- Use semantic HTML -->
<main id="app">
    <section id="room-selection">
        <label for="room-input">Room Name</label>
        <input id="room-input" type="text" required>
    </section>
</main>

<!-- Accessibility attributes -->
<button aria-label="Toggle microphone" id="mic-toggle">
    <i class="fa-solid fa-microphone" aria-hidden="true"></i>
</button>
```

### CSS Organization
```css
/* Use consistent naming */
.video-container { }
.video-container__local { }
.video-container__remote { }

/* Mobile-first responsive design */
@media (min-width: 768px) {
    /* Desktop styles */
}
```

## 🚀 Performance Optimization

### Current Performance Issues
1. **No resource optimization**: Large external dependencies
2. **No caching**: Static files not cached
3. **No compression**: Files served uncompressed

### Optimization Checklist
- [ ] Minify CSS and JavaScript
- [ ] Optimize image assets
- [ ] Implement caching headers
- [ ] Use CDN for external libraries
- [ ] Compress WebRTC video streams

## 🔒 Security Considerations

### Current Security Gaps
1. **No HTTPS**: Required for WebRTC in production
2. **No room authentication**: Anyone can join any room
3. **No rate limiting**: Potential for abuse

### Security Implementation Plan
```javascript
// HTTPS setup (production)
const https = require('https');
const fs = require('fs');

// Room authentication
const authenticateRoom = (roomId, password) => {
    // Implementation needed
};

// Rate limiting
const rateLimit = require('express-rate-limit');
```

## 📊 Monitoring & Debugging

### Debug Tools
```javascript
// Enable WebRTC debugging
localStorage.setItem('webrtc-internals', 'true');

// Console debugging
console.group('WebRTC Debug');
console.log('ICE Connection State:', pc.iceConnectionState);
console.log('Signaling State:', pc.signalingState);
console.groupEnd();
```

### Production Monitoring
- [ ] Error logging service
- [ ] Performance monitoring
- [ ] User analytics
- [ ] Connection quality metrics

## 🤝 Contributing Guidelines

### Code Contribution Process
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Follow code style guidelines
4. Add tests for new functionality
5. Update documentation
6. Submit pull request

### Issue Reporting
Include in bug reports:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Console error messages
- Network connectivity status

---

## 📞 Getting Help

### Resources
- [WebRTC Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Socket.IO Guide](https://socket.io/docs/v4/)
- [Express.js Documentation](https://expressjs.com/)

### Community
- GitHub Issues for bug reports
- Stack Overflow for technical questions
- WebRTC community forums

**Happy coding! 🚀**