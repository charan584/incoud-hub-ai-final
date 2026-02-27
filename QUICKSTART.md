# Quick Start Guide

## Installation Steps

1. Open terminal in project root folder
2. Run: `npm install`
3. Run: `npm start`

## If pages don't load:

The issue is likely missing dependencies. Make sure you have:
- Node.js installed
- All dependencies installed via `npm install`

## Backend Setup

1. Open new terminal
2. Run: `cd server`
3. Run: `npm install`
4. Run: `npm start`

## Common Issues:

### "Module not found" errors
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

### Pages show blank
- Check browser console for errors
- Ensure all dependencies are installed
- Try clearing browser cache

## Manual Dependency Installation

If npm install fails, install individually:

```bash
npm install react react-dom react-router-dom react-scripts axios gsap zustand
```

## Port Configuration

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

Make sure these ports are not in use by other applications.
