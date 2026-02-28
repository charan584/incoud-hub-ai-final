# 🚀 Incloudhub AI - Startup Guide

## ✅ System Status Check

### Test 1: MongoDB Connection
```bash
cd server
node test-connection.js
```
Expected: ✅ MongoDB Connected Successfully

### Test 2: Backend Server
```bash
cd server
node test-login.js
```
Expected: ✅ Backend is running, ✅ Login endpoint is working

---

## 🎯 Quick Start (3 Steps)

### Step 1: Start MongoDB
**Option A - Using Batch File:**
```
Double-click: START_MONGODB.bat
```

**Option B - Command Line (as Administrator):**
```bash
net start MongoDB
```

**Option C - Manual Start:**
```bash
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"
```

### Step 2: Start Backend Server
```bash
cd server
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
✅ Email server is ready to send messages
🚀 Server running on port 5000
```

### Step 3: Start Frontend
```bash
npm start
```

Opens: http://localhost:3000

---

## 🔍 Troubleshooting

### Problem: "Cannot connect to server"
**Solution:** Backend is not running
```bash
cd server
npm start
```

### Problem: "MongoDB Connection Error"
**Solution:** MongoDB is not running
```bash
net start MongoDB
```

### Problem: "Please verify your email first"
**Solution:** 
1. Click "Resend OTP" button on login page
2. Check your email for OTP
3. Go to register page and verify

### Problem: OTP not received
**Solution:**
1. Check spam/junk folder
2. Verify email in server console logs
3. Check server shows: "OTP email sent successfully"

---

## 📊 Database Status

**Connection:** ✅ Working
**Database:** incloudhub
**Host:** localhost:27017

**Collections:**
- users (for student accounts)
- admins (for admin accounts)
- sessions (for study scheduler)
- resources (for resources engine)

---

## 🧪 Test Accounts

After registration and OTP verification, you can login with your credentials.

**Admin Access:**
- Go to: http://localhost:3000/admin-login
- Admin Key: incloudhub_admin_2024

---

## 📝 Important Notes

1. **MongoDB must be running** before starting the backend
2. **Backend must be running** before using the frontend
3. **OTP expires in 10 minutes** - request new one if expired
4. **Email verification is required** for all new accounts

---

## 🆘 Need Help?

Run diagnostics:
```bash
cd server
node test-connection.js
node test-login.js
```

Check logs in server console for detailed error messages.
