const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

app.use(cors());


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const detectMimeType = (buffer) => {
    const mimeSignatures = {
        '89504e47': 'image/png',
        '25504446': 'application/pdf',
        '504b0304': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'd0cf11e0': 'application/vnd.ms-powerpoint',
    };

    const fileSignature = buffer.toString('hex', 0, 4);
    return mimeSignatures[fileSignature] || 'unknown';
};
app.post('/bfhl', (req, res) => {
    const userId = 'Mukul_Bhalla_27112002';
    const email = 'mb9792@srmist.edu.in';
    const rollNumber = 'RA2111003030252';
    const data = req.body.data || [];
    const fileB64 = req.body.file_b64 || '';

    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => /^[A-Za-z]$/.test(item));


    const highestLowercaseAlphabet = alphabets
        .filter(item => /^[a-z]$/.test(item))
        .sort((a, b) => b.localeCompare(a))[0] || '';


    let fileValid = false;
    let fileMimeType = '';
    let fileSizeKb = 0;

    if (fileB64) {
        try {

            const fileBuffer = Buffer.from(fileB64, 'base64');
            fileSizeKb = fileBuffer.length / 1024;


            fileMimeType = detectMimeType(fileBuffer);
            fileValid = fileMimeType !== 'unknown';

            fileValid = true;
        } catch (error) {
            fileValid = false;
        }
    }

    const response = {
        is_success: true,
        user_id: userId,
        email: email,
        roll_number: rollNumber,
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : []
    };


    if (fileValid) {
        response.file_valid = true;
        response.file_mime_type = fileMimeType;
        response.file_size_kb = fileSizeKb;
    } else {
        response.file_valid = false;
    }

    res.json(response);
});

app.get('/bfhl', (req, res) => {
    res.json({ operation_code: 1 });
});

app.get('/', (req, res) => {
    res.send("Hello");
});

app.listen(port, () => {
    console.log("Listening at PORT 3000");
});