// Get references to important HTML elements
const sendButton = document.getElementById('send-btn'); // Send button
const userInput = document.getElementById('user-input'); // Input field for user message
const chatBox = document.getElementById('chat-box'); // Chatbox to display messages

// Function to add a message to the chat box
function addMessage(message, isUser) {
    const messageDiv = document.createElement('div'); // Create a new div for the message
    messageDiv.classList.add('chat-message'); // Add styling class to the message
    
    if (isUser) {
        messageDiv.classList.add('user-message'); // Add class for user messages
    } else {
        messageDiv.classList.add('ai-message'); // Add class for AI messages
    }

    messageDiv.textContent = message; // Set the message text
    chatBox.appendChild(messageDiv); // Add the message div to the chat box

    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
}

// Function to send the message to the backend and get AI response
async function sendMessage() {
    const message = userInput.value.trim(); // Get the user's input and remove extra spaces

    if (message === "") {
        return; // If the input is empty, do nothing
    }

    addMessage(message, true); // Add user's message to chat box

    // Clear the input field after sending
    userInput.value = "";

    try {
        // Send the message to the backend (your Express server)
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message }), // Send the user's message in the body
        });

        const data = await response.json(); // Wait for the server response

        // Add the AI's reply to the chat box
        addMessage(data.reply, false);

    } catch (error) {
        console.error("Error:", error);
        addMessage("Sorry, something went wrong. Please try again later.", false);
    }
}

// Event listener for when the user clicks the 'Send' button
sendButton.addEventListener('click', sendMessage);

// Event listener for when the user presses 'Enter' key to send the message
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage(); // Send the message if 'Enter' is pressed
    }
});
