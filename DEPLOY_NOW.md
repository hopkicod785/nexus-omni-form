# 🚀 Deploy to Railway - Step by Step

## Step 1: Create GitHub Repository

1. **Go to [GitHub.com](https://github.com)** and sign in
2. **Click the "+" icon** → **"New repository"**
3. **Repository name**: `nexus-omni-form`
4. **Description**: `Nexus Omni Installation Authorization Form`
5. **Make it Public** (required for free Railway deployment)
6. **Click "Create repository"**

## Step 2: Upload Your Code to GitHub

**Option A: Using GitHub Desktop (Easiest)**
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Clone your new repository
3. Copy all your project files into the repository folder
4. Commit and push

**Option B: Using Command Line**
```bash
# In your project folder
git init
git add .
git commit -m "Initial commit - Nexus Omni form"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nexus-omni-form.git
git push -u origin main
```

**Option C: Using GitHub Web Interface**
1. Go to your repository on GitHub
2. Click "uploading an existing file"
3. Drag and drop all your project files
4. Commit the changes

## Step 3: Deploy to Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up** with your GitHub account
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your `nexus-omni-form` repository**
6. **Railway will automatically detect** it's a Node.js app
7. **Click "Deploy"**
8. **Wait 2-3 minutes** for deployment to complete

## Step 4: Add Database

1. **In your Railway project dashboard**
2. **Click "New"** → **"Database"** → **"PostgreSQL"**
3. **Railway will create** a PostgreSQL database
4. **The connection string** will be automatically added as `DATABASE_URL`

## Step 5: Get Your Live URLs

After deployment, Railway will give you:
- **Form URL**: `https://nexus-omni-form-production.up.railway.app`
- **Admin URL**: `https://nexus-omni-form-production.up.railway.app/admin`

## Step 6: Test Your Deployment

1. **Visit your form URL** and fill out the form
2. **Submit the form** and verify it works
3. **Visit your admin URL** and check that the submission appears
4. **Test approve/reject** functionality

## Step 7: Share with RSMs

Send them an email:
```
Subject: Nexus Omni Installation Authorization Form

Hi [RSM Name],

Please use the following link to submit Nexus Omni installation authorization requests:

[YOUR RAILWAY URL]

This form will automatically submit to our authorization team for review.

Best regards,
[Your Name]
```

## 🎉 You're Live!

Your form is now:
- ✅ **Accessible worldwide**
- ✅ **Storing submissions in a database**
- ✅ **Admin panel for management**
- ✅ **Automatic HTTPS**
- ✅ **Scalable and reliable**

## Troubleshooting

**If deployment fails:**
- Check that all files are uploaded to GitHub
- Ensure `package.json` is in the root directory
- Verify Node.js version compatibility

**If database doesn't work:**
- Make sure PostgreSQL is added to your Railway project
- Check that `DATABASE_URL` environment variable is set

**Need help?**
- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app

## Next Steps

- **Custom domain** (optional): Add your own domain in Railway settings
- **Email notifications** (optional): Set up email alerts for new submissions
- **Backup strategy**: Railway automatically backs up your database
- **Monitoring**: Use Railway's built-in monitoring tools

**Your form is now live and ready for RSMs to use!** 🚀
