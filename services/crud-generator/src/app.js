const express = require("express");
const bodyParser = require("body-parser");
const { generateCRUD } = require("./generator");
const fs = require("fs-extra");
const amqp = require("amqplib");

const app = express();
const PORT = 5007;

// Middleware
app.use(bodyParser.json());

// RabbitMQ configuration
const RABBITMQ_HOST = "amqp://localhost:5672";
const RABBITMQ_QUEUE = "speech_events"; 

// Function to process messages from RabbitMQ
async function processMessage(message) {
    try {
        const content = JSON.parse(message.content.toString());
        console.log("[x] Received message:", content);

        if (content.event_type === "app_ready_to_generate") {
            const { model_id } = content.payload;

            if (!model_id) {
                console.error("Missing model_id in message payload.");
                return;
            }

            console.log(`[x] Starting CRUD generation for model_id: ${model_id}`);

            // Create a directory specific to the model_id
            const outputDir = `./src/output/model_${model_id}`;
            await fs.ensureDir(outputDir); // Ensure the directory exists

            // Generate the CRUD application
            await generateCRUD(model_id, outputDir);

            console.log(`[x] CRUD application generated at ${outputDir}`);
        }
    } catch (err) {
        console.error("[!] Error processing message:", err.message);
    }
}

// Function to set up RabbitMQ connection
async function setupRabbitMQ() {
    try {
        const connection = await amqp.connect(RABBITMQ_HOST);
        const channel = await connection.createChannel();

        await channel.assertQueue(RABBITMQ_QUEUE, {
            durable: false, // Ensure this matches the queue's existing configuration
        });
        console.log(`[x] Listening for messages on queue: ${RABBITMQ_QUEUE}`);

        channel.consume(
            RABBITMQ_QUEUE,
            (message) => {
                processMessage(message);
                channel.ack(message); // Acknowledge the message after processing
            },
            { noAck: false }
        );
    } catch (err) {
        console.error("[!] RabbitMQ connection error:", err.message);
    }
}

// Endpoint to generate CRUD app manually via HTTP
app.post("/generate", async (req, res) => {
    try {
        const { modelId } = req.body; // Expect a model ID from the request
        if (!modelId) {
            return res.status(400).json({ error: "modelId is required" });
        }

        // Create a directory specific to the modelId
        const outputDir = `./src/output/model_${modelId}`;
        await fs.ensureDir(outputDir); // Ensure the directory exists

        // Call the generator with the dynamic output directory
        await generateCRUD(modelId, outputDir);

        res.status(200).json({
            message: "CRUD application generated",
            output: outputDir,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Start the HTTP server
app.listen(PORT, () => {
    console.log(`CRUD Generator Service running at http://localhost:${PORT}`);

    // Start RabbitMQ listener after the HTTP server starts
    setupRabbitMQ();
});