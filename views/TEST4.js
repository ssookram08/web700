// Import the necessary modules
const express = require('express');
const bodyParser = require('body-parser');

// Instantiate the Express application
const app = express();

// Configure the application to use body-parser for urlencoded forms
app.use(bodyParser.urlencoded({ extended: true }));

// Define the "/addEmployee" route
app.post('/addEmployee', (req, res) => {
    // Retrieve the "position" and "department" data from the form
    const position = req.body.position;
    const department = req.body.department;
    
    // Formulate the response message
    const message = `a new ${position} position added to the department: ${department}`;

    // Send back the JSON formatted response
    res.json({ message });
});

// Set the server to listen on a specific port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
