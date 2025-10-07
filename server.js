require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const Database = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
let database;
async function initializeDatabase() {
    try {
        database = new Database();
        // Wait for database to be fully initialized
        await new Promise((resolve, reject) => {
            const checkInit = () => {
                if (database.initialized) {
                    resolve();
                } else if (database.db && !database.initialized) {
                    // If db exists but not initialized, wait a bit more
                    setTimeout(checkInit, 100);
                } else {
                    setTimeout(checkInit, 100);
                }
            };
            checkInit();
        });
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
        // Fallback to JSON file storage if database fails
        const fs = require('fs');
        const path = require('path');
        const DATA_FILE = path.join(__dirname, 'submissions.json');
        
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
        }
        
        // Simple fallback functions
        database = {
            createSubmission: async (submission) => {
                const submissions = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
                submissions.push(submission);
                fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));
            },
            getAllSubmissions: async () => {
                return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            },
            getSubmissionById: async (id) => {
                const submissions = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
                return submissions.find(s => s.id === id);
            },
            updateSubmissionStatus: async (id, status) => {
                const submissions = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
                const index = submissions.findIndex(s => s.id === id);
                if (index !== -1) {
                    submissions[index].status = status;
                    submissions[index].statusUpdated = new Date().toISOString();
                    fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));
                }
            }
        };
        console.log('Using JSON file fallback for data storage');
    }
}

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
        const requiredFields = ['distributorName', 'endUser', 'installDate', 'neededByDate', 'shippingAddress', 'shippingCity', 'shippingState', 'shippingZip', 'rsm', 'acknowledgment'];
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
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: database ? 'Connected' : 'Fallback mode'
    });
});

// Debug endpoint to check database status
app.get('/api/debug', async (req, res) => {
    try {
        const submissions = await database.getAllSubmissions();
        res.json({
            success: true,
            database: 'Working',
            submissionCount: submissions.length,
            submissions: submissions
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message,
            database: 'Error'
        });
    }
});

// Start server
async function startServer() {
    await initializeDatabase();
    
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Admin panel available at http://localhost:${PORT}/admin`);
        console.log(`Health check available at http://localhost:${PORT}/health`);
    });
}

startServer().catch(console.error);
