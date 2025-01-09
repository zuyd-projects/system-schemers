import React, { useState, useRef, useEffect } from "react";
import axios from "axios"; // Add Axios for HTTP requests
import "../styles/globals.css";

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0); // Timer state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp4" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        audioChunksRef.current = [];

        // Send the audioBlob to the backend
        await sendAudioToBackend(audioBlob);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      // Start the timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error("An error occurred while starting the recording:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);

    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (!isRecording) {
      setRecordingTime(0); // Reset the timer when recording stops
    }
  }, [isRecording]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const sendAudioToBackend = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.mp4");

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Backend response:", response.data);
      alert("Audio uploaded and processed successfully!");
    } catch (error) {
      console.error("Error uploading audio:", error);
      alert("Failed to upload audio.");
    }
  };

  return (
    <div className="audio-recorder-container">
      <div className="audio-recorder-box">
        <h1>Audio Recorder</h1>
        {isRecording && (
          <div className="timer">
            <p>Recording Time: {formatTime(recordingTime)}</p>
          </div>
        )}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`record-button ${isRecording ? "stop" : "start"}`}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>

        {audioUrl && (
          <div className="audio-controls">
            <audio controls src={audioUrl}></audio>
            <a href={audioUrl} download="recording.mp4" className="download-link">
              Download Recording
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;