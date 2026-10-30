# How to Add Web Platform in Appwrite Console

This is **required** for your app to work! Without this, you'll get CORS errors and login will fail.

## Step-by-Step Instructions

### 1. Go to Appwrite Console
- Visit: https://cloud.appwrite.io
- Login to your account
- Select your project (Project ID: `697257f10008a4cad661`)

### 2. Navigate to Settings
- Look at the left sidebar
- Click on **"Settings"** (usually at the bottom of the sidebar)
- You should see tabs: **General**, **Web Platform**, **Mobile Platform**, etc.

### 3. Go to Web Platform Tab
- Click on the **"Web Platform"** tab
- You'll see a section for "Platforms" or "Web Apps"

### 4. Add Your Platform
- Click **"Add Platform"** or **"Create Platform"** button
- Select **"Web App"** or **"Web"** option

### 5. Configure Platform
Fill in the details:

**Platform Name:** (optional, e.g., "Development" or "Local")

**Hostname:** 
- For local development: `localhost`
- Or leave empty for localhost

**Important - Add these URLs:**
- `http://localhost:9002`
- `http://localhost:3000` (if you use default Next.js port)
- `http://127.0.0.1:9002` (alternative)

**For Production (later):**
- Add your deployed domain (e.g., `https://yourdomain.com`)
- Add Vercel domain (e.g., `https://*.vercel.app`)

### 6. Save/Update
- Click **"Create"** or **"Update"** button
- You should see your platform listed

### 7. Restart Your Dev Server
After adding the platform:
```bash
# Stop your server (Ctrl+C)
npm run dev
```

## Visual Guide

```
Appwrite Console
├── Settings (left sidebar)
│   ├── General
│   ├── Web Platform ← Click here!
│   │   └── Add Platform button
│   │       └── Hostname: localhost
│   │       └── URLs: http://localhost:9002
│   └── Mobile Platform
```

## What This Does

Adding the web platform:
- ✅ Allows your app to make requests to Appwrite
- ✅ Enables CORS (Cross-Origin Resource Sharing)
- ✅ Allows cookies/sessions to work
- ✅ Fixes login authentication

## After Adding Platform

1. **Restart your dev server** (important!)
2. **Clear browser cache** (or use incognito)
3. **Try login again**

## Troubleshooting

### Can't find "Web Platform" tab?
- Make sure you're in the correct project
- Check if you're on the Settings page
- Some Appwrite versions might call it "Platforms" or "Web Apps"

### Still getting CORS errors?
- Make sure you added `http://localhost:9002` (exact match)
- Check for typos in the URL
- Restart dev server after adding platform
- Try clearing browser cache

### Multiple platforms?
- You can add multiple platforms
- One for localhost (development)
- One for production domain (later)

## Quick Checklist

- [ ] Opened Appwrite Console
- [ ] Went to Settings → Web Platform
- [ ] Added platform with `http://localhost:9002`
- [ ] Saved/Updated
- [ ] Restarted dev server
- [ ] Tried login again

After completing these steps, your login should work! 🎉
