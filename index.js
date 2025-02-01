const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
const port = 3000 || process.env.PORT;

// Initialize the WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth() // This will save the session locally
});

// Generate QR code for authentication
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Log in confirmation
client.on('ready', () => {
    console.log('Client is ready!');
});

// Start the client
client.initialize();

app.get("/ping", (req, res) => {
    console.log("hit on /ping");
    
  res.status(200).end();
});

// Route to send a message
app.get('/send-message', async (req, res) => {
    const { number, message } = req.query;

    if (!number || !message) {
        return res.status(400).send('Please provide both number and message parameters.');
    }

    try {
        // Format the number to include the country code and remove any non-numeric characters
        const formattedNumber = number.replace(/\D/g, '') + '@c.us';

        // Send the message
        const sentMessage = await client.sendMessage(formattedNumber, message);
        res.send(`Message sent to ${formattedNumber}: ${sentMessage.body}`);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Failed to send message.');
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});