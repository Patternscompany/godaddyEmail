const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const app = express();
app.use(express.static(path.join(__dirname, 'public')));  
 // Set the directory containing your templates

 const uploadsDir = path.join(__dirname, 'uploads');
 if (!fs.existsSync(uploadsDir)){
     fs.mkdirSync(uploadsDir);
 }

// Body parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
    }
  });

  const upload = multer({ storage: storage });

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: 'smtpout', // Replace with your SMTP server address
    port: 550,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'example@gmail.com', // Replace with your SMTP username
        pass: 'example' // Replace with your SMTP password
    },
    logger: true, // Enable logging
    debug: true // Set logging level to "debug"
});

// Listen for "error" event
transporter.on('error', (error) => {
    console.error('Error occurred while connecting to SMTP server:', error);
});

// Listen for "connect" event
transporter.on('connect', () => {
    console.log('Successfully connected to SMTP server.');
});

// Route for handling form submission
app.post('/send-email',upload.single('resume'), (req, res) => {
    // Extract form data
    const { name, email, message} = req.body;
    const resumePath = req.file.path;
    // Email options
    const mailOptions = {
        from: 'example@gmail.com',
        to: 'our@gmail.com',
        subject: `New message from ${name}`,
        html: `<p>Name:${name}</p>
        <p>${email}</p>
        
        <p>Message: ${message}</p>`,
        attachments: [
            {
              filename: req.file.originalname,
              path: resumePath
            }
          ]
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email could not be sent. Error:', error);
            res.status(500).send('Something went wrong. Please try again later.');
        } else {
            console.log('Email has been sent successfully.', info.response);
            res.status(200).redirect('thank-you.html');
        }
    });
});

// Define a route for the root URL
app.get('/', (req, res) => {
    res.redirect('index.html');  // Redirect to 'index.html' in the 'public' directory
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
