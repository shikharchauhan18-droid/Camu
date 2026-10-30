# Troubleshooting Login Issues

If login is failing despite correct credentials, check these common issues:

## 1. Check Browser Console

Open browser DevTools (F12) → Console tab and look for errors when you try to login. Common errors:

### Error: "Invalid credentials"
- **Solution**: Double-check email/password in Appwrite Console
- Verify the user exists in Auth → Users
- Make sure password is correct (case-sensitive)

### Error: "CORS" or "Network" error
- **Solution**: Configure CORS in Appwrite:
  1. Go to Appwrite Console → Settings → Web Platform
  2. Add your URL: `http://localhost:9002`
  3. Click "Update"

### Error: "Project not found"
- **Solution**: Check `.env.local` file:
  - `NEXT_PUBLIC_APPWRITE_PROJECT_ID=697257f10008a4cad661`
  - Restart dev server after changing `.env.local`

### Error: "Email/Password provider not enabled"
- **Solution**: Enable Email/Password auth:
  1. Go to Appwrite Console → Auth → Settings
  2. Enable "Email/Password"
  3. Click "Update"

## 2. Verify Appwrite Configuration

### Check Environment Variables
Make sure `.env.local` has:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=697257f10008a4cad661
```

**Important**: Restart your dev server (`npm run dev`) after changing `.env.local`

### Verify User Exists
1. Go to Appwrite Console → Auth → Users
2. Check if your user email exists
3. If not, create the user (see CREATE_TEST_USER.md)

## 3. Common Issues & Solutions

### Issue: "Session creation failed"
**Possible causes:**
- CORS not configured
- Cookies blocked by browser
- Incorrect endpoint

**Solutions:**
1. Add `http://localhost:9002` to Appwrite Web Platform settings
2. Check browser settings - allow cookies for localhost
3. Try incognito/private window
4. Clear browser cache and cookies

### Issue: Login succeeds but redirect fails
**Solution**: Check if protected routes are working. The user might be logged in but the redirect is failing.

### Issue: "Invalid response format"
**Solution**: Check Appwrite SDK version compatibility. Make sure you're using the latest version:
```bash
npm install appwrite@latest
```

## 4. Debug Steps

1. **Check Network Tab**
   - Open DevTools → Network tab
   - Try to login
   - Look for requests to `cloud.appwrite.io`
   - Check if they return 200 (success) or error codes

2. **Check Console Logs**
   - The login function logs errors to console
   - Look for detailed error messages

3. **Test Appwrite Directly**
   - Try creating a session using Appwrite Console
   - Go to Auth → Users → Select user → Create Session
   - If this works, the issue is in the app code
   - If this fails, the issue is in Appwrite configuration

4. **Verify User Status**
   - In Appwrite Console → Auth → Users
   - Check if user status is "Active"
   - Check if email is verified (if verification is required)

## 5. Quick Fixes

### Fix 1: Restart Dev Server
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### Fix 2: Clear Browser Data
- Clear cookies for localhost
- Clear cache
- Try incognito mode

### Fix 3: Re-check Appwrite Settings
1. Project ID matches `.env.local`
2. Email/Password auth is enabled
3. CORS includes `http://localhost:9002`
4. User exists and is active

### Fix 4: Check Appwrite SDK Version
```bash
npm list appwrite
# Should show version 15.x or higher
```

## 6. Still Not Working?

If none of the above works:

1. **Check the exact error message** in browser console
2. **Check Appwrite Console logs** (if available)
3. **Verify all environment variables** are loaded:
   - Add `console.log(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)` temporarily
   - Should show: `697257f10008a4cad661`

4. **Test with a simple script**:
   Create `test-login.js`:
   ```javascript
   const { Client, Account } = require('appwrite');
   const client = new Client()
     .setEndpoint('https://cloud.appwrite.io/v1')
     .setProject('697257f10008a4cad661');
   const account = new Account(client);
   
   account.createEmailPasswordSession('your-email@example.com', 'your-password')
     .then(response => console.log('Success:', response))
     .catch(error => console.error('Error:', error));
   ```

## Need More Help?

Share the exact error message from browser console, and I can help debug further!
