import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../styles/globals.css";

/**
 * Removes punctuation from a string, leaving only letters, digits, whitespace, and underscores (as part of \w).
 * Adjust the regex as needed if you want to allow other characters or remove underscores.
 */
function removePunctuation(input: string): string {
  // This regex removes any character that is not a word character or whitespace.
  // Word characters: letters (a-z, A-Z), digits (0-9), and underscore (_).
  // Whitespace: spaces, tabs, line breaks, etc.
  return input.replace(/[^\w\s]/g, "");
}

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  // Store the raw transcription from Whisper
  const [transcription, setTranscription] = useState<string | null>(null);

  // Store an editable version of the transcription
  const [editedTranscription, setEditedTranscription] = useState<string>("");

  // Refs for MediaRecorder and audio chunks
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // AudioContext ref for conversion
  const audioContextRef = useRef<AudioContext | null>(null);

  // Ref to track recording timer
  const timerRef = useRef<number | null>(null);

  // ----------------------------
  // START / STOP RECORDING LOGIC
  // ----------------------------
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

        // Convert MP4 to WAV
        const wavBlob = await convertMp4ToWav(audioBlob);
        if (wavBlob) {
          // Send the WAV blob to OpenAI for transcription
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

  // ----------------------------
  // AUDIO -> WAV CONVERSION LOGIC
  // ----------------------------
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

      writeWavHeader(view, sampleRate, numberOfChannels, length);

      // Write WAV data
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

  // ----------------------------
  // OPENAI TRANSCRIPTION LOGIC
  // ----------------------------
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

      const transcribedText = removePunctuation(response.data.text);
      // Set both the raw transcription and the editable version
      setTranscription(transcribedText);
      setEditedTranscription(transcribedText);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      alert("Failed to transcribe audio.");
    }
  };

  // ----------------------------
  // SEND EDITED TEXT TO BACKEND
  // ----------------------------
  const sendTranscriptionToBackend = async (text: string) => {
    try {
      const response = await axios.post("http://localhost:5008/api/send-transcription", { text });
      if (response.status === 200) {
        alert("Transcription sent successfully!");
      } else {
        alert("Failed to send transcription.");
      }
    } catch (error) {
      console.error("Error sending transcription to backend:", error);
      alert("An error occurred while sending the transcription.");
    }
  };

  // ----------------------------
  // TIMER UTILS
  // ----------------------------
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

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <div className="audio-recorder-container">
      <div className="audio-recorder-box">
        <h1>Audio Recorder</h1>

        {/* Timer while recording */}
        {isRecording && (
          <div className="timer">
            <p>Recording Time: {formatTime(recordingTime)}</p>
          </div>
        )}

        {/* Start/Stop Recording Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`record-button ${isRecording ? "stop" : "start"}`}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>

        {/* Playback and Download */}
        {audioUrl && (
          <div className="audio-controls">
            <audio controls src={audioUrl}></audio>
            <a href={audioUrl} download="recording.mp4" className="download-link">
              Download Recording
            </a>
          </div>
        )}

        {/* Editable Transcription */}
        {transcription && (
          <div className="transcription">
            <h2>Transcription</h2>
            <textarea
              value={editedTranscription}
              onChange={(e) => setEditedTranscription(e.target.value)}
              rows={5}
              cols={50}
            />
            <div>
              <button onClick={() => sendTranscriptionToBackend(editedTranscription)}>
                Send Edited Transcription
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;