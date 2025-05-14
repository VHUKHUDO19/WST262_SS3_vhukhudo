// Node.js Express Server

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Load JSON data
const loadJsonFile = (filename) => {
    try {
        const rawData = fs.readFileSync(path.join(__dirname, 'data', filename));
        return JSON.parse(rawData);
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        return [];
    }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes for courses
app.get('/api/courses', (req, res) => {
    const courses = loadJsonFile('courses.json');
    res.json(courses);
});

app.get('/api/featured-courses', (req, res) => {
    const courses = loadJsonFile('courses.json');
    // Return first 3 courses as featured
    res.json(courses.slice(0, 3));
});

app.get('/api/courses/:id', (req, res) => {
    const courses = loadJsonFile('courses.json');
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
});

// API Routes for team and testimonials
app.get('/api/team', (req, res) => {
    const team = loadJsonFile('team.json');
    res.json(team);
});

app.get('/api/testimonials', (req, res) => {
    const testimonials = loadJsonFile('testimonials.json');
    res.json(testimonials);
});

// API Route for feedback submission
app.post('/api/feedback', (req, res) => {
    try {
        const feedback = req.body;

        // Add timestamp
        feedback.timestamp = new Date().toISOString();

        // Read existing feedback
        let feedbacks = [];
        try {
            feedbacks = loadJsonFile('feedback.json');
        } catch (error) {
            // If file doesn't exist or is invalid, start with empty array
            feedbacks = [];
        }

        // Add new feedback
        feedbacks.push(feedback);

        // Write to file
        fs.writeFileSync(
            path.join(__dirname, 'data', 'feedback.json'),
            JSON.stringify(feedbacks, null, 2)
        );

        res.status(201).json({ success: true, message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ success: false, message: 'Failed to submit feedback' });
    }
});

// Forward all other requests to the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Node.js server is running on port ${PORT}`);
});