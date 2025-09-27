// defining necessary variables and DOM
let divSelectRoom = document.getElementById("selectRoom")
let divconsultingRoom = document.getElementById("consultingRoom")
let inputRoomNumber = document.getElementById("roomNumber")
let btnGoRoom = document.getElementById("goRoom")
let localVideo = document.getElementById("localVideo")
let remoteVideo = document.getElementById("remoteVideo")
let btnMike = document.getElementById("mike")
let btnCamera = document.getElementById("camera")
let btnLeaveRoom = document.getElementById("leaveRoom")
let statusText = document.getElementById("statusText")
let remoteLabel = document.getElementById("remoteLabel")

let roomNumber, localStream, remoteStream, rtcPeerConnection, isCaller
let isAudioEnabled = true
let isVideoEnabled = true

// adding ICE server configuration
const iceServers = {
    iceServers: [
        { urls: 'stun:stun.services.mozilla.com' },
        { urls: 'stun:stun.l.google.com:19302' }
    ]
}

const streamConstraints = {
    audio: true,
    video: true
}

// Media control functions
function toggleMicrophone() {
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0]
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled
            isAudioEnabled = audioTrack.enabled
            
            // Update button appearance
            btnMike.innerHTML = isAudioEnabled 
                ? '<i class="fa-solid fa-microphone"></i>' 
                : '<i class="fa-solid fa-microphone-slash"></i>'
            btnMike.style.backgroundColor = isAudioEnabled ? '' : '#ff4444'
            
            console.log('Microphone:', isAudioEnabled ? 'enabled' : 'disabled')
        }
    }
}

function toggleCamera() {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0]
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled
            isVideoEnabled = videoTrack.enabled
            
            // Update button appearance
            btnCamera.innerHTML = isVideoEnabled 
                ? '<i class="fa-solid fa-camera"></i>' 
                : '<i class="fa-solid fa-camera-slash"></i>'
            btnCamera.style.backgroundColor = isVideoEnabled ? '' : '#ff4444'
            
            console.log('Camera:', isVideoEnabled ? 'enabled' : 'disabled')
        }
    }
}

// Room entry function
async function enterRoom() {
    console.log("Entering room...")
    
    // Validate room input
    if (!inputRoomNumber.value || inputRoomNumber.value.trim() === '') {
        alert("Please enter a valid room name")
        return
    }
    
    roomNumber = inputRoomNumber.value.trim()
    console.log("Room ID:", roomNumber)
    
    try {
        // Get user media
        localStream = await navigator.mediaDevices.getUserMedia(streamConstraints)
        localVideo.srcObject = localStream
        
        // Switch to video interface
        divSelectRoom.style.display = "none"
        divconsultingRoom.style.display = "block"
        
        console.log("Local video stream started successfully")
        
    } catch (error) {
        console.error("Error accessing media devices:", error)
        alert("Could not access camera/microphone. Please check permissions and try again.")
    }
}

// Socket.IO connection
const socket = io();
const peerConnections = new Map(); // Store multiple peer connections

// WebRTC functions
async function createPeerConnection(remoteSocketId) {
    const peerConnection = new RTCPeerConnection(iceServers);
    
    // Add local stream to peer connection
    if (localStream) {
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
    }
    
    // Handle remote stream
    peerConnection.ontrack = (event) => {
        console.log('Received remote stream from:', remoteSocketId);
        remoteVideo.srcObject = event.streams[0];
        remoteLabel.textContent = 'Remote User';
        updateStatus('Video call connected!', 'connected');
    };
    
    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('ice-candidate', {
                targetUserId: remoteSocketId,
                candidate: event.candidate,
                roomId: roomNumber
            });
        }
    };
    
    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
        console.log(`Connection state with ${remoteSocketId}:`, peerConnection.connectionState);
    };
    
    peerConnections.set(remoteSocketId, peerConnection);
    return peerConnection;
}

async function makeCall(remoteSocketId) {
    console.log('Making call to:', remoteSocketId);
    
    const peerConnection = await createPeerConnection(remoteSocketId);
    
    // Create offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    
    // Send offer through signaling server
    socket.emit('offer', {
        targetUserId: remoteSocketId,
        offer: offer,
        roomId: roomNumber
    });
}

async function handleOffer(offer, fromUserId) {
    console.log('Handling offer from:', fromUserId);
    
    const peerConnection = await createPeerConnection(fromUserId);
    
    // Set remote description
    await peerConnection.setRemoteDescription(offer);
    
    // Create answer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    
    // Send answer through signaling server
    socket.emit('answer', {
        targetUserId: fromUserId,
        answer: answer,
        roomId: roomNumber
    });
}

async function handleAnswer(answer, fromUserId) {
    console.log('Handling answer from:', fromUserId);
    
    const peerConnection = peerConnections.get(fromUserId);
    if (peerConnection) {
        await peerConnection.setRemoteDescription(answer);
    }
}

async function handleIceCandidate(candidate, fromUserId) {
    const peerConnection = peerConnections.get(fromUserId);
    if (peerConnection) {
        await peerConnection.addIceCandidate(candidate);
    }
}

// Socket event listeners
socket.on('room-joined', (data) => {
    console.log('Joined room successfully:', data);
    updateStatus(`Connected to room: ${roomNumber}`, 'connected');
    
    if (data.users.length > 0) {
        updateStatus(`Connecting to ${data.users.length} user(s)...`, 'connecting');
        // If there are other users, initiate calls to them
        data.users.forEach(userId => {
            makeCall(userId);
        });
    } else {
        updateStatus(`Waiting for others to join room: ${roomNumber}`, 'waiting');
    }
});

socket.on('user-joined', (data) => {
    console.log('New user joined:', data);
    updateStatus('New user joined, connecting...', 'connecting');
    // New user will initiate the call, so we just wait for their offer
});

socket.on('user-left', (data) => {
    console.log('User left:', data);
    updateStatus('User disconnected', 'disconnected');
    
    // Clean up peer connection
    if (peerConnections.has(data.userId)) {
        peerConnections.get(data.userId).close();
        peerConnections.delete(data.userId);
    }
    
    // Clear remote video if it was from this user
    if (remoteVideo.srcObject) {
        remoteVideo.srcObject = null;
        remoteLabel.textContent = 'Waiting for others...';
        updateStatus(`Waiting for others to join room: ${roomNumber}`, 'waiting');
    }
});

socket.on('offer', async (data) => {
    updateStatus('Receiving call...', 'connecting');
    await handleOffer(data.offer, data.fromUserId);
});

socket.on('answer', async (data) => {
    updateStatus('Call connected!', 'connected');
    await handleAnswer(data.answer, data.fromUserId);
});

socket.on('ice-candidate', async (data) => {
    await handleIceCandidate(data.candidate, data.fromUserId);
});

// Enhanced room entry function
async function enterRoom() {
    console.log("Entering room...")
    
    // Validate room input
    if (!inputRoomNumber.value || inputRoomNumber.value.trim() === '') {
        alert("Please enter a valid room name")
        return
    }
    
    roomNumber = inputRoomNumber.value.trim()
    console.log("Room ID:", roomNumber)
    
    try {
        // Get user media first
        localStream = await navigator.mediaDevices.getUserMedia(streamConstraints)
        localVideo.srcObject = localStream
        
        // Switch to video interface
        divSelectRoom.style.display = "none"
        divconsultingRoom.style.display = "block"
        
        console.log("Local video stream started successfully")
        
        // Join the room via Socket.IO
        socket.emit('join-room', {
            roomId: roomNumber,
            userId: socket.id
        });
        
    } catch (error) {
        console.error("Error accessing media devices:", error)
        alert("Could not access camera/microphone. Please check permissions and try again.")
    }
}

// Leave room function
function leaveRoom() {
    console.log("Leaving room...");
    
    // Stop local stream
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    
    // Close all peer connections
    peerConnections.forEach(pc => pc.close());
    peerConnections.clear();
    
    // Clear video elements
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
    
    // Reset UI
    divSelectRoom.style.display = "block";
    divconsultingRoom.style.display = "none";
    
    // Reset button states
    isAudioEnabled = true;
    isVideoEnabled = true;
    btnMike.innerHTML = '<i class="fa-solid fa-microphone"></i>';
    btnCamera.innerHTML = '<i class="fa-solid fa-camera"></i>';
    btnMike.style.backgroundColor = '';
    btnCamera.style.backgroundColor = '';
    
    // Clear room number
    roomNumber = null;
    inputRoomNumber.value = '';
}

// Update status function
function updateStatus(message, className = '') {
    statusText.textContent = message;
    statusText.className = className;
}

// Event listeners
btnGoRoom.onclick = enterRoom
btnMike.onclick = toggleMicrophone
btnCamera.onclick = toggleCamera
btnLeaveRoom.onclick = leaveRoom

// Enhanced socket event listeners with status updates
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    updateStatus('Disconnected from server', 'disconnected');
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    leaveRoom();
});