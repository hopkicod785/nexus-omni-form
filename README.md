# Nexus Omni Installation Authorization Form

A modern, dark-themed form for Nexus Omni installation authorization requests with a Node.js backend for storing submissions.

## Features

- **Modern Dark Theme**: Clean, professional design with consistent color palette
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Form Validation**: Real-time validation with error messages
- **Backend Storage**: Node.js/Express backend with JSON file storage
- **Admin Panel**: View and manage all submissions
- **Status Management**: Approve/reject submissions
- **Print Support**: Print-friendly form layout

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - **Form**: http://localhost:3000
   - **Admin Panel**: http://localhost:3000/admin

## Usage

### For RSMs (Regional Sales Managers)
1. Open the form at http://localhost:3000
2. Fill out all required fields:
   - Distributor Name
   - Install Date
   - Equipment Needed By Date
   - Equipment quantities
   - Accessories quantities
   - RSM name
   - Acknowledgment checkbox
3. Click "Submit to Authorization Team"
4. Form will be saved and a confirmation will be shown

### For Administrators
1. Open the admin panel at http://localhost:3000/admin
2. View all submissions with status overview
3. Click the eye icon to view full submission details
4. Approve or reject pending submissions using the action buttons

## API Endpoints

- `POST /api/submit` - Submit a new form
- `GET /api/submissions` - Get all submissions
- `GET /api/submissions/:id` - Get a specific submission
- `PUT /api/submissions/:id/status` - Update submission status

## Data Storage

Submissions are stored in `submissions.json` in the project root. Each submission includes:
- Unique ID
- Timestamp
- All form data
- Status (pending, approved, rejected)
- Status update timestamp

## Configuration

To change the email recipient for the old email functionality, update the `CONFIG` object in `script.js`:

```javascript
const CONFIG = {
    recipientEmail: 'authorization@nexusomni.com', // Change this
    subjectPrefix: 'Nexus Omni Installation Authorization Request'
};
```

## File Structure

```
├── index.html          # Main form
├── admin.html          # Admin panel
├── styles.css          # Styling
├── script.js           # Frontend JavaScript
├── server.js           # Backend server
├── package.json        # Dependencies
├── submissions.json    # Data storage (created automatically)
└── README.md           # This file
```

## Development

The project uses:
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Node.js with Express
- **Storage**: JSON file (can be easily migrated to database)
- **Styling**: CSS custom properties for consistent theming

## License

MIT License
