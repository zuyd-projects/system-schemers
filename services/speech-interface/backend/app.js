const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const amqp = require("amqplib");
const axios = require("axios");
const { RABBITMQ_HOST, RABBITMQ_QUEUE, OPENAI_API_KEY } = require("./config");

const app = express();
const upload = multer({ dest: "uploads/" }); // Temp storage for audio files

app.use(bodyParser.json());

// Transcribe and send to RabbitMQ
app.post("/upload", upload.single("audio"), async (req, res) => {
    try {
        const audioFile = req.file;

        if (!audioFile) {
            return res.status(400).json({ error: "No audio file uploaded" });
        }

        // Transcribe using OpenAI Whisper
        const transcription = await transcribeAudio(audioFile.path);

        if (!transcription) {
            return res.status(500).json({ error: "Failed to transcribe audio" });
        }

        // Send transcription to RabbitMQ
        const event = {
            event_type: "speech_to_text",
            payload: {
                text: transcription,
            },
        };

        await sendToRabbitMQ(event);

        res.json({ message: "Audio processed and sent", transcription });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred" });
    }
});

// Transcribe audio using OpenAI Whisper API
async function transcribeAudio(audioPath) {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/audio/transcriptions",
            { file: audioPath, model: "whisper-1" },
            { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
        );

        return response.data.text;
    } catch (err) {
        console.error("Error transcribing audio:", err);
        return null;
    }
}

// Send event to RabbitMQ
async function sendToRabbitMQ(message) {
    try {
        const connection = await amqp.connect(RABBITMQ_HOST);
        const channel = await connection.createChannel();

        await channel.assertQueue(RABBITMQ_QUEUE, { durable: true });
        channel.sendToQueue(RABBITMQ_QUEUE, Buffer.from(JSON.stringify(message)));

        console.log("[x] Sent:", message);
        await channel.close();
        await connection.close();
    } catch (err) {
        console.error("Error sending to RabbitMQ:", err);
    }
}

// Start server
const PORT = 5008;
app.listen(PORT, () => {
    console.log(`Producer backend running on http://localhost:${PORT}`);
});