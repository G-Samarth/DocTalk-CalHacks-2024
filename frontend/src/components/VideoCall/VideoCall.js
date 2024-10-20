import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";

const VideoCallPage = () => {
  const [callStatus, setCallStatus] = useState("not_started");
  const [recordingStatus, setRecordingStatus] = useState("");
  const [error, setError] = useState("");
  const [downloadProgress, setDownloadProgress] = useState(null);

  const checkCallAndRecordingStatus = async () => {
    try {
      const response = await fetch("/api/check-call-and-recording");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.callEnded) {
        setCallStatus("ended");
        if (data.recordingReady && data.downloadedFilePath) {
          setRecordingStatus(
            `Recording downloaded: ${data.downloadedFilePath}`
          );
          setDownloadProgress(100);
        } else if (data.recordingReady) {
          setRecordingStatus("Recording ready. Initiating download...");
          setDownloadProgress(0);
        } else {
          setRecordingStatus(
            "Call ended. Waiting for recording to be ready..."
          );
        }
      } else {
        setCallStatus("in_progress");
        setRecordingStatus("Call in progress...");
      }
    } catch (error) {
      setError(`Error checking status: ${error.message}`);
    }
  };

  useEffect(() => {
    const checkStatus = () => {
      checkCallAndRecordingStatus();
      if (callStatus === "ended" && !recordingStatus.includes("downloaded")) {
        setTimeout(checkStatus, 500); // Check every 500ms
      }
    };

    const intervalId = setInterval(checkStatus, 500); // Regular check every 500ms

    return () => {
      clearInterval(intervalId);
    };
  }, [callStatus, recordingStatus]);

  const launchVideoCall = () => {
    try {
      window.open("https://doc-talk.daily.co/doc-talk", "_blank");
      setCallStatus("in_progress");
    } catch (error) {
      setError("Failed to launch video call. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="p-4 flex justify-center">
        <button
          onClick={launchVideoCall}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Start Video Call
        </button>
      </div>
    </Layout>
  );
};

export default VideoCallPage;
