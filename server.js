require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
const database = new Database();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('.'));

// Routes

// Submit form
app.post('/api/submit', async (req, res) => {
    try {
        const formData = req.body;
        
        // Validate required fields
        const requiredFields = ['distributorName', 'installDate', 'neededByDate', 'rsm', 'acknowledgment'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }
        
        // Create submission object
        const submission = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            status: 'pending',
            ...formData
        };
        
        // Save to database
        await database.createSubmission(submission);
        
        res.json({
            success: true,
            message: 'Form submitted successfully',
            submissionId: submission.id
        });
        
    } catch (error) {
        console.error('Error processing submission:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Get all submissions
app.get('/api/submissions', async (req, res) => {
    try {
        const submissions = await database.getAllSubmissions();
        res.json({
            success: true,
            submissions: submissions
        });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch submissions'
        });
    }
});

// Get single submission
app.get('/api/submissions/:id', async (req, res) => {
    try {
        const submission = await database.getSubmissionById(req.params.id);
        
        if (!submission) {
            return res.status(404).json({
                success: false,
                error: 'Submission not found'
            });
        }
        
        res.json({
            success: true,
            submission: submission
        });
    } catch (error) {
        console.error('Error fetching submission:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch submission'
        });
    }
});

// Update submission status
app.put('/api/submissions/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'approved', 'rejected'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status. Must be one of: pending, approved, rejected'
            });
        }
        
        await database.updateSubmissionStatus(req.params.id, status);
        const updatedSubmission = await database.getSubmissionById(req.params.id);
        
        res.json({
            success: true,
            message: 'Status updated successfully',
            submission: updatedSubmission
        });
        
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Admin page route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin panel available at http://localhost:${PORT}/admin`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
});
