# V-call 📞

A WebRTC-based video calling application that allows users to create and join video chat rooms directly in their browser.

![V-call Interface](https://img.shields.io/badge/Status-In%20Development-yellow)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![Express](https://img.shields.io/badge/Express-4.18.2-blue)
![WebRTC](https://img.shields.io/badge/WebRTC-Enabled-orange)

## 🌟 Features

### Current Features
- 🎥 **Local Video Stream**: Access and display user's camera feed
- 🎤 **Audio Capture**: Microphone access for voice communication
- 🏠 **Room-based System**: Join video calls using room names/IDs
- 📱 **Responsive UI**: Bootstrap-based interface that works on desktop and mobile
- 🎨 **Modern Design**: Clean, professional interface with Font Awesome icons

### Planned Features (Coming Soon)
- 👥 **Multi-user Video Calls**: Connect multiple participants in real-time
- 🔇 **Media Controls**: Toggle camera and microphone on/off
- 📡 **Real-time Signaling**: WebSocket-based peer connection establishment
- 🔒 **Room Security**: Password-protected rooms and user authentication
- 📱 **Screen Sharing**: Share your screen with other participants
- 💬 **Text Chat**: In-call messaging system
- 📊 **Connection Statistics**: Monitor call quality and connection status

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm (comes with Node.js)
- Modern web browser with WebRTC support (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RanjanKhadka012/V-call.git
   cd V-call
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   node app.js
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage

### Starting a Video Call

1. **Enter Room Name**: Type a unique room identifier in the input field
2. **Join Room**: Click "Go to the Room" button
3. **Grant Permissions**: Allow camera and microphone access when prompted
4. **Share Room ID**: Give the same room name to others you want to call

### Current Limitations
> ⚠️ **Note**: This is currently a work-in-progress. The application can capture your local video but cannot yet connect to other users. See [Development Status](#-development-status) for more details.

## 🏗️ Architecture

```
V-call/
├── app.js              # Express server (serves static files)
├── package.json        # Project dependencies and scripts
├── public/            # Client-side files
│   ├── index.html     # Main application interface
│   ├── main.js        # WebRTC client logic
│   └── index.css      # Application styling
└── README.md          # Project documentation
```

### Technology Stack
- **Backend**: Node.js + Express.js
- **Frontend**: Vanilla JavaScript + HTML5 + CSS3
- **Styling**: Bootstrap 5.3.2 + Font Awesome 6.5.1
- **Real-time Communication**: WebRTC API
- **Media**: getUserMedia API for camera/microphone access

## 🔧 Development Status

### ✅ Completed
- [x] Basic Express server setup
- [x] Static file serving
- [x] User interface design
- [x] Local media capture (camera/microphone)
- [x] Bootstrap responsive layout

### 🚧 In Progress
- [ ] WebRTC peer connection establishment
- [ ] Signaling server implementation (WebSocket/Socket.IO)
- [ ] Room management system
- [ ] Media control functionality

### 📋 Roadmap
- [ ] Multi-user support
- [ ] Text chat integration
- [ ] Screen sharing capability
- [ ] Mobile optimization
- [ ] Recording functionality
- [ ] User authentication

## 🛠️ Development

### Running in Development Mode
```bash
# Start the server with auto-restart (requires nodemon)
npm install -g nodemon
nodemon app.js

# Or run normally
node app.js
```

### Project Structure
```
├── app.js           # Main server file
├── public/
│   ├── index.html   # Entry point HTML
│   ├── main.js      # Client-side WebRTC logic
│   └── index.css    # Custom styles
└── package.json     # Dependencies and metadata
```

## 🐛 Known Issues

1. **JavaScript Syntax Error**: Invalid `addEventListener.getElementById()` call in `main.js`
2. **Missing Signaling**: No WebSocket server for peer connection signaling
3. **Incomplete WebRTC**: Peer connection establishment not implemented
4. **Non-functional Controls**: Camera/microphone toggle buttons don't work
5. **No Room Management**: Users can't actually connect to the same room

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Setup
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/V-call.git
cd V-call

# Install dependencies
npm install

# Start development server
node app.js
```

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [WebRTC](https://webrtc.org/) - For real-time communication APIs
- [Bootstrap](https://getbootstrap.com/) - For responsive UI components
- [Font Awesome](https://fontawesome.com/) - For beautiful icons
- [Express.js](https://expressjs.com/) - For the web server framework

## 📞 Support

If you have any questions or run into issues:

1. Check the [Issues](https://github.com/RanjanKhadka012/V-call/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your setup and the issue

---

**Made with ❤️ by [RanjanKhadka012](https://github.com/RanjanKhadka012)**

> 💡 **Tip**: This project is perfect for learning WebRTC! Feel free to experiment and extend the functionality.