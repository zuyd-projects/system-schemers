import React, { useState, useRef, useEffect } from "react";
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
      alert("Opnemen wordt niet ondersteund in deze browser.");
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

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp4" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      // Start de timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error("Er is een fout opgetreden bij het starten van de opname:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);

    // Stop de timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (!isRecording) {
      setRecordingTime(0); // Reset de timer wanneer opname stopt
    }
  }, [isRecording]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="audio-recorder-container">
      <div className="audio-recorder-box">
        <h1>Audio Recorder</h1>
        {isRecording && (
          <div className="timer">
            <p>Opname Tijd: {formatTime(recordingTime)}</p>
          </div>
        )}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`record-button ${isRecording ? "stop" : "start"}`}
        >
          {isRecording ? "Stop Opnemen" : "Start Opname"}
        </button>

        {audioUrl && (
          <div className="audio-controls">
            <audio controls src={audioUrl}></audio>
            <a href={audioUrl} download="opname.mp4" className="download-link">
              Download Opname
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
