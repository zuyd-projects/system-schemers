const express = require("express");
const bodyParser = require("body-parser");
const amqp = require("amqplib");

const app = express();

// Manually set CORS headers
app.use((req, res, next) => {
  // Allow only your React app origin or use '*'
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  // Allow certain request headers
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use(bodyParser.json());

// Endpoint to receive transcription text
app.post("/api/send-transcription", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No transcription text provided" });
  }

  try {
    // Prepare the event to send to RabbitMQ
    const event = {
      event_type: "speech_to_text",
      payload: {
        text,
      },
    };

    // Send the event to RabbitMQ
    await sendToRabbitMQ(event);

    res.status(200).json({
      message: "Transcription received and sent to RabbitMQ",
      event,
    });
  } catch (err) {
    console.error("Error processing transcription:", err);
    res
      .status(500)
      .json({ error: "An error occurred while processing the transcription" });
  }
});

// Function to send data to RabbitMQ
async function sendToRabbitMQ(message) {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue("speech_events", { durable: false });
    channel.sendToQueue("speech_events", Buffer.from(JSON.stringify(message)));

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
  console.log(`Backend running on http://localhost:${PORT}`);
});
