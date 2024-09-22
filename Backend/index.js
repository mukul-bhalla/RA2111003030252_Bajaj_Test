const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

// CORS setup
app.use(cors());

// Middleware to handle large JSON requests
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Utility function to detect MIME type from file signature
const detectMimeType = (buffer) => {
    const mimeSignatures = {
        '89504e47': 'image/png',
        '25504446': 'application/pdf',
        '504b0304': 'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
        'd0cf11e0': 'application/vnd.ms-powerpoint', // PPT (old)
    };

    const fileSignature = buffer.toString('hex', 0, 4);
    return mimeSignatures[fileSignature] || 'unknown';
};

app.post('/bfhl', (req, res) => {
    const userId = 'Mukul_Bhalla_27112002';  // Adjust to your full name and birthdate
    const email = 'bhallamukul27@gmail.com';            // Update to your email
    const rollNumber = 'RA2111003030252';               // Update to your roll number
    const data = req.body.data || [];           // Input data array
    const fileB64 = req.body.file_b64 || '';    // Base64 file string

    // Separate numbers and alphabets
    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => /^[A-Za-z]$/.test(item));

    // Find the highest lowercase alphabet
    const highestLowercaseAlphabet = alphabets
        .filter(item => /^[a-z]$/.test(item))
        .sort((a, b) => b.localeCompare(a))[0] || '';

    // File handling
    let fileValid = false;
    let fileMimeType = '';
    let fileSizeKb = 0;

    if (fileB64) {
        try {
            // Convert Base64 to buffer
            const fileBuffer = Buffer.from(fileB64, 'base64');
            fileSizeKb = fileBuffer.length / 1024;  // Calculate file size in KB

            // Detect MIME type
            fileMimeType = detectMimeType(fileBuffer);
            fileValid = fileMimeType !== 'unknown';
        } catch (error) {
            fileValid = false;
        }
    }

    // Build response object
    const response = {
        is_success: true,
        user_id: userId,
        email: email,
        roll_number: rollNumber,
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : []
    };

    // Conditionally add file information
    if (fileValid) {
        response.file_valid = true;
        response.file_mime_type = fileMimeType;
        response.file_size_kb = fileSizeKb;
    } else {
        response.file_valid = false;
    }

    // Send response
    res.json(response);
});


// GET endpoint
app.get('/bfhl', (req, res) => {
    res.json({ operation_code: 1 });
});

// Default GET route
app.get('/', (req, res) => {
    res.send("Hello");
});

// Start server
app.listen(port, () => {
    console.log("Listening at PORT 3000");
});