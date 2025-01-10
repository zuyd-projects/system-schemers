import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../styles/globals.css";

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/mp4" });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp4" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Zet MP4 om naar WAV
        const wavBlob = await convertMp4ToWav(audioBlob);
        if (wavBlob) {
          await sendAudioToOpenAI(wavBlob);
        }

        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const convertMp4ToWav = async (mp4Blob: Blob): Promise<Blob | null> => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      const arrayBuffer = await mp4Blob.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

      // WAV-specific settings
      const numberOfChannels = audioBuffer.numberOfChannels;
      const sampleRate = audioBuffer.sampleRate;
      const length = audioBuffer.length * numberOfChannels;
      const wavBuffer = new ArrayBuffer(44 + length * 2);
      const view = new DataView(wavBuffer);

      // WAV header
      writeWavHeader(view, sampleRate, numberOfChannels, length);

      // WAV data
      let offset = 44;
      for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        const channelData = audioBuffer.getChannelData(i);
        for (let j = 0; j < channelData.length; j++) {
          view.setInt16(offset, channelData[j] * 0x7fff, true);
          offset += 2;
        }
      }

      return new Blob([view], { type: "audio/wav" });
    } catch (error) {
      console.error("Error converting MP4 to WAV:", error);
      return null;
    }
  };

  const writeWavHeader = (view: DataView, sampleRate: number, channels: number, dataLength: number) => {
    const blockAlign = channels * 2;
    const byteRate = sampleRate * blockAlign;

    // RIFF chunk
    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + dataLength * 2, true); // File size
    writeString(view, 8, "WAVE");

    // fmt sub-chunk
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true); // Subchunk size
    view.setUint16(20, 1, true); // Audio format (PCM)
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true); // Bits per sample

    // data sub-chunk
    writeString(view, 36, "data");
    view.setUint32(40, dataLength * 2, true); // Data chunk size
  };

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const sendAudioToOpenAI = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");
    formData.append("model", "whisper-1");

    try {
      const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setTranscription(response.data.text);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      alert("Failed to transcribe audio.");
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!isRecording) {
      setRecordingTime(0);
    }
  }, [isRecording]);

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

        {transcription && (
          <div className="transcription">
            <h2>Transcription</h2>
            <p>{transcription}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
