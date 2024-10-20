import React, { useState, useRef, useEffect } from "react";
import { Button } from "../Button/Button.js";
import {
  Mic,
  MicOff,
  Upload,
  Video,
  VideoOff,
  FileText,
  Calendar,
} from "lucide-react";
import Layout from "../Layout/Layout.js";

const VideoChatNew = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const [summaryStatus, setSummaryStatus] = useState(null);
  const [summaryProgress, setSummaryProgress] = useState(0);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const videoRef = useRef(null);

  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoStream]);

  const startVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const stopVideoStream = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
  };

  const startRecording = async () => {
    try {
      await startVideoStream();
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaRecorder.current = new MediaRecorder(audioStream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      stopVideoStream();
    }
  };

  const uploadAudio = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append("audio", audioBlob, `recording_${Date.now()}.wav`);

    try {
      setUploadStatus("uploading");
      const response = await fetch("http://localhost:4000/save-audio", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Audio uploaded and processed:", data);
      setTranscription(data.result);
      setUploadStatus("success");

      // Start summary generation process
      setSummaryStatus("generating");
      startSummaryProgress();
    } catch (error) {
      console.error("Error uploading audio:", error);
      setUploadStatus("error");
    }
  };

  const startSummaryProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setSummaryProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setSummaryStatus("completed");
      }
    }, 2400); // 4 minutes = 240 seconds, 240 * 1000 / 100 = 2400ms for each 1% increase
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-red-700 text-center">
          Audio Recorder
        </h1>
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-full max-w-2xl aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
            {videoStream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <VideoOff className="text-gray-400" size={64} />
              </div>
            )}
            {isRecording && (
              <div className="absolute top-4 right-4 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
          <div className="flex justify-center space-x-4 mb-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
            >
              {isRecording ? (
                <MicOff className="mr-2" />
              ) : (
                <Mic className="mr-2" />
              )}
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
            <Button
              onClick={uploadAudio}
              disabled={!audioBlob}
              variant="outline"
            >
              <Upload className="mr-2" />
              Upload Recording
            </Button>
          </div>
          {audioBlob && (
            <div className="mt-4 w-full max-w-md">
              <audio
                src={URL.createObjectURL(audioBlob)}
                controls
                className="w-full"
              />
            </div>
          )}
        </div>
        {uploadStatus && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              uploadStatus === "success"
                ? "bg-green-100 text-green-700"
                : uploadStatus === "error"
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {uploadStatus === "success" && (
              <>
                <p className="font-semibold">Upload successful!</p>
                {summaryStatus === "generating" && (
                  <div className="mt-2">
                    <p>Generating summary... This may take a few minutes.</p>
                    <div className="w-full bg-green-200 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-green-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${summaryProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {summaryStatus === "completed" && (
                  <div className="mt-2">
                    <p className="flex items-center">
                      <FileText className="mr-2" size={18} />
                      Summary generation complete!
                    </p>
                    <p className="flex items-center mt-1 text-sm">
                      <Calendar className="mr-2" size={16} />
                      You can find the summary PDF in your{" "}
                      <a
                        href="/doctor/calendar"
                        className="text-blue-600 hover:text-blue-800 underline ml-1"
                      >
                        doctor/calendar
                      </a>
                      section.
                    </p>
                  </div>
                )}
              </>
            )}
            {uploadStatus === "error" && "Upload failed. Please try again."}
            {uploadStatus === "uploading" && "Uploading..."}
          </div>
        )}
        <div className="p-6"></div>
        {transcription && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Transcription:</h2>
            <p>{transcription}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VideoChatNew;
