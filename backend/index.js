// Import required modules
const express = require("express"); // To create and manage the server
const bodyParser = require("body-parser"); // To parse incoming request bodies (e.g., JSON data)
const cors = require("cors"); // To allow cross-origin requests (important for frontend-backend communication)
const axios = require("axios"); // To make HTTP requests to the Hugging Face API
require("dotenv").config(); // To securely store and access the API key in the .env file

// Create an Express application
const app = express(); // 'app' is our server instance

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing to allow requests from different origins
app.use(bodyParser.json()); // Automatically parse JSON data in incoming requests

// Hugging Face API token stored in the .env file
const HF_API_KEY = process.env.HF_API_KEY; // Read the API key securely from the .env file

// Define the API endpoint for sending user messages to Hugging Face
app.post("/chat", async (req, res) => {
  // Async function to handle incoming chat requests
  try {
    // Extract the user's message from the request body
    const userMessage = req.body.message;

    // Send the user's message to the Hugging Face API
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct", // API endpoint for Falcon-7B-Instruct model
      {
        inputs: userMessage, // User's input message sent as 'inputs' to the Hugging Face API
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`, // Hugging Face requires the API key to be included as a Bearer token
        },
      }
    );

    // Clean the AI's response
    let aiResponse = response.data[0].generated_text.trim(); // Get the generated text and trim any surrounding whitespace

    // Limit response to a maximum length (100 characters) to avoid excessively long responses
    aiResponse = aiResponse.slice(0, 100); // Cut off at 100 characters to prevent overly long answers

    // Remove excessive repetitions (if any)
    aiResponse = aiResponse.replace(/(b\.)+/g, ""); // Removes repeated instances of 'b.' that might have occurred

    // If the AI response is empty or just punctuation, handle it gracefully
    if (!aiResponse || aiResponse === ".") {
      aiResponse = "Sorry, I didn't understand that. Can you ask again?";
    }

    // Send the cleaned and formatted AI's response back to the frontend
    res.json({
      reply: aiResponse + ".", // Append the period back to make the response grammatically correct
    });
  } catch (error) {
    // Handle errors (e.g., missing API key, rate limits, or other API issues)
    console.error("Error communicating with Hugging Face API:", error); // Log the error for debugging

    // Respond to the frontend with an error message
    res.status(500).json({
      error: "An error occurred while processing your request. Please try again later.", // Friendly error message for the user
    });
  }
});

// Start the server on a specific port
const PORT = process.env.PORT || 5000; // Use the port from .env or default to 5000
app.listen(PORT, () => {
  // Callback to confirm the server is running
  console.log(`Server is running on http://localhost:${PORT}`); // Log the server's running status and URL
});
