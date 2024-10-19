import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import Layout from "../Layout/Layout";
import { Button } from "../Button/Button.js";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  Copy,
} from "lucide-react";
import "./VideoChat.css";

const socket = io("http://localhost:4000", {
  transports: ["websocket"],
  cors: {
    origin: "http://localhost:3000",
  },
});

function VideoChat() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });

    socket.on("me", (id) => setMe(id));

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

    return () => {
      socket.off("me");
      socket.off("callUser");
    };
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
  };

  const toggleMute = () => {
    if (stream) {
      setIsMuted(!isMuted);
      stream.getAudioTracks()[0].enabled = isMuted;
    }
  };

  const toggleVideo = () => {
    if (stream) {
      setIsVideoOff(!isVideoOff);
      stream.getVideoTracks()[0].enabled = isVideoOff;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(me).then(() => {
      alert("ID copied to clipboard!");
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-red-700 text-center">
          Dr. Chat
        </h1>
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div className="video-container">
            {stream && (
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                className="rounded-lg"
              />
            )}
          </div>
          <div className="video-container">
            {callAccepted && !callEnded ? (
              <video
                playsInline
                ref={userVideo}
                autoPlay
                className="rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-full rounded-lg">
                <p className="text-gray-500">Waiting for call...</p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-center space-x-4 mb-10">
            <Button
              onClick={toggleMute}
              variant={isMuted ? "destructive" : "outline"}
            >
              {isMuted ? <MicOff /> : <Mic />}
            </Button>
            <Button
              onClick={toggleVideo}
              variant={isVideoOff ? "destructive" : "outline"}
            >
              {isVideoOff ? <VideoOff /> : <Video />}
            </Button>
            {callAccepted && !callEnded ? (
              <Button onClick={leaveCall} variant="destructive">
                <PhoneOff />
              </Button>
            ) : (
              <Button onClick={() => callUser(idToCall)} variant="default">
                <Phone />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="ID to call"
              value={idToCall}
              onChange={(e) => setIdToCall(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-gray-700">Your ID: {me || "Loading..."}</span>
            <Button onClick={copyToClipboard} variant="outline" size="sm">
              <Copy size={16} />
            </Button>
          </div>
        </div>
        {receivingCall && !callAccepted && (
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold mb-2">{name} is calling...</h3>
            <Button onClick={answerCall} variant="default">
              Answer
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default VideoChat;
