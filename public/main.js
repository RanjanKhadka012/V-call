// defining necessary variables and DOM
let divSelectRoom = document.getElementById("selectRoom")
let divconsultingRoom = document.getElementById("consultingRoom")
let inputRoomNumber = document.getElementById("roomNumber")
let btnGoRoom = document.getElementById("goroom")
let localVideo = document.getElementById("localVideo")
let remoteVideo = document.getElementById("remoteVideo")

let roomNumber, localStream, remoteStream, rtcPeerConnection, isCaller

// adding ICE server
const iceServer = {
    'iceServer': [
        { 'urls': 'stun:stun.services.mozilla.com' },
        {
            'urls': 'stun:stun.l.google.com:19302'
        }
    ]
}

const streamConstraints = {
    audio: true,
    video: true
}
// when button is clicked
btnGoRoom.addEventListener.onclick = () => {
    if (inputRoomNumber.value == '') {
        alert("Room id invalid")
    } else {
        navigator.mediaDevices.getUserMedia(streamConstraints)
            .then(stream => {
                localStream = stream,
                    localvideo.srcObject = stream
            })
            .catch(err => {
                console.log("an error occured", err)
            })
        div.divSelectRoom.style = "display: none"
        divconsultingRoom.style = 'display: block'
    }
}