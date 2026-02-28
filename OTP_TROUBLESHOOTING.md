# OTP Email Troubleshooting Guide

## Issue: OTP emails not being sent

### Quick Fix Steps:

1. **Start MongoDB** (REQUIRED)
   - Double-click `START_MONGODB.bat` in the project root
   - OR run: `net start MongoDB` in Command Prompt (as Administrator)
   - OR manually start MongoDB service from Windows Services

2. **Verify Email Configuration**
   - Email: charanp326@gmail.com
   - App Password: drphqaoievkfixyi (configured in .env)
   - ✅ Email configuration is working

3. **Start Backend Server**
   ```bash
   cd server
   npm start
   ```
   
   You should see:
   - ✅ MongoDB Connected Successfully
   - ✅ Email server is ready to send messages
   - 🚀 Server running on port 5000

4. **Test Registration**
   - Go to http://localhost:3000/register
   - Enter name, email, password
   - Click "Send OTP"
   - Check your email inbox (and spam folder)

### Common Issues:

**MongoDB Not Running:**
- Error: "MongoDB Connection Error"
- Fix: Start MongoDB using START_MONGODB.bat

**Email Not Sending:**
- Check server console for "OTP email sent successfully"
- Check spam/junk folder
- Verify Gmail app password is correct

**OTP Expired:**
- OTP expires in 10 minutes
- Request a new OTP if expired

### Server Console Logs:
When registration works, you'll see:
```
Registration attempt for: user@email.com
Generated OTP: 123456
Sending OTP email to: user@email.com
OTP email sent successfully
```

### Need Help?
1. Check server console for error messages
2. Verify MongoDB is running: `mongod --version`
3. Test email: Run the email test in server folder
