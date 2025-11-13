let localStream;
let remoteStream;
let peerConnection;

const config = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }
  ]
};

async function startCall() {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  document.getElementById("localVideo").srcObject = localStream;

  peerConnection = new RTCPeerConnection(config);

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = event => {
    remoteStream = event.streams[0];
    document.getElementById("remoteVideo").srcObject = remoteStream;
  };

  // This demo won't create a real remote connection (you'd need signaling server for that)
  console.log("Call started (simulation)");
}

function endCall() {
  peerConnection?.close();
  document.getElementById("localVideo").srcObject = null;
  document.getElementById("remoteVideo").srcObject = null;
  console.log("Call ended");
}
