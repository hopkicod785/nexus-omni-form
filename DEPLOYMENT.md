# Live Deployment Guide

This guide will help you deploy the Nexus Omni form to a live URL that you can share with RSMs.

## Option 1: Railway (Recommended - Easiest)

### Steps:
1. **Go to [Railway.app](https://railway.app)**
2. **Sign up** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Connect your GitHub account** and select this repository
6. **Railway will automatically detect** the Node.js app and deploy it
7. **Wait for deployment** (usually 2-3 minutes)
8. **Get your live URL** from the Railway dashboard

### Your live URLs will be:
- **Form**: `https://your-app-name.railway.app`
- **Admin Panel**: `https://your-app-name.railway.app/admin`

---

## Option 2: Render (Free Tier Available)

### Steps:
1. **Go to [Render.com](https://render.com)**
2. **Sign up** with GitHub
3. **Click "New +"** → **"Web Service"**
4. **Connect your GitHub repository**
5. **Configure**:
   - **Name**: `nexus-omni-form`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. **Click "Create Web Service"**
7. **Wait for deployment** (usually 5-10 minutes)

### Your live URLs will be:
- **Form**: `https://nexus-omni-form.onrender.com`
- **Admin Panel**: `https://nexus-omni-form.onrender.com/admin`

---

## Option 3: Vercel (Serverless)

### Steps:
1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up** with GitHub
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Vercel will auto-detect** the configuration
6. **Click "Deploy"**
7. **Wait for deployment** (usually 2-3 minutes)

### Your live URLs will be:
- **Form**: `https://nexus-omni-form.vercel.app`
- **Admin Panel**: `https://nexus-omni-form.vercel.app/admin`

---

## Before Deploying

### 1. Create a GitHub Repository
```bash
# In your project folder
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/nexus-omni-form.git
git push -u origin main
```

### 2. Update Configuration (Optional)
If you want to change the email recipient, update `script.js`:
```javascript
const CONFIG = {
    recipientEmail: 'your-email@company.com', // Change this
    subjectPrefix: 'Nexus Omni Installation Authorization Request'
};
```

---

## After Deployment

### 1. Test the Form
- Visit your live URL
- Fill out and submit the form
- Check that it works properly

### 2. Test the Admin Panel
- Visit `your-url/admin`
- Verify you can see submissions
- Test approve/reject functionality

### 3. Share with RSMs
Send them the form URL:
```
Subject: Nexus Omni Installation Authorization Form

Hi [RSM Name],

Please use the following link to submit Nexus Omni installation authorization requests:

[YOUR LIVE URL]

This form will automatically submit to our authorization team for review.

Best regards,
[Your Name]
```

---

## Troubleshooting

### Common Issues:
- **Build fails**: Check that all dependencies are in `package.json`
- **App won't start**: Ensure `server.js` is the main file
- **Database errors**: The app uses JSON file storage, no database needed
- **CORS errors**: Already configured in the server

### Support:
- **Railway**: [Railway Discord](https://discord.gg/railway)
- **Render**: [Render Support](https://render.com/docs)
- **Vercel**: [Vercel Support](https://vercel.com/help)

---

## Recommended: Railway

Railway is the easiest option because:
- ✅ Automatic deployment from GitHub
- ✅ Free tier available
- ✅ Easy to use dashboard
- ✅ Automatic HTTPS
- ✅ Custom domains available
- ✅ Good for Node.js apps

Your form will be live and accessible to RSMs worldwide!
