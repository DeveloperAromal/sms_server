const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const cors = require('cors'); // Import the cors middleware
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

const accountSid = "ACa9b331c3964c172337d0ed8bd5626c0e";
const authToken = "db5c411b512e01e9b8f943c06c62658e";

if (!accountSid || !authToken) {
  throw new Error('Twilio account SID and auth token must be provided.');
}

const client = twilio(accountSid, authToken);

app.use(cors()); // Use the cors middleware
app.use(bodyParser.json());

app.post('/api/sms', async (req, res) => {
  try {
    const { name, phone, class: classSelected, div: divSelected } = req.body;

    // Check for missing fields
    if (!name || !phone || !classSelected || !divSelected) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send SMS using Twilio
    const message = await client.messages.create({
      to: phone,
      from: '+17247650571',
      body: `Hello, ${name} is marked as absent in class ${classSelected} ${divSelected}.`,
    });

    res.status(200).json({ sid: message.sid });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
