# Freelancer Analytics Dashboard - Quick Start Guide

## 🚀 Quick Start (3 Steps)

### Step 1: Configure MongoDB Connection

1. Open `backend\.env` file (create it from `.env.example` if it doesn't exist)
2. Replace the MongoDB URI with your credentials:

```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.mongodb.net/freelancer_analytics
```

### Step 2: Start Backend Server

Open a PowerShell terminal:

```powershell
cd c:\Users\HP\Desktop\frelancer\backend
npm run dev
```

Wait for: `✅ MongoDB Connected`

### Step 3: Seed Database (First Time Only)

Open another PowerShell terminal:

```powershell
cd c:\Users\HP\Desktop\frelancer\backend
npm run seed
```

Wait for: `🎉 Database seeding completed successfully!`

### Step 4: Start Frontend

Open another PowerShell terminal:

```powershell
cd c:\Users\HP\Desktop\frelancer\frontend
npm run dev
```

Wait for the URL, then open: `http://localhost:3000`

## 🎯 You're Done!

The dashboard should now be running with 50 demo freelancers loaded.

## 📊 What You'll See

- **Overview Dashboard**: Active vs Inactive freelancers with donut chart
- **Skill Heatmap**: Regional skill distribution
- **Performance**: Top performers ranked by performance index
- **All Freelancers**: Complete list with filters

## ⚠️ Common Issues

**"Cannot connect to MongoDB"**
→ Check your MONGO_URI in `backend\.env`

**"Port already in use"**
→ Close other instances or change PORT in `.env`

**"No data showing"**
→ Make sure you ran `npm run seed` to populate the database

## 💡 Pro Tips

- Keep all 3 terminals open while developing
- Use `Ctrl+C` to stop any server
- Run `npm run seed` again to reset data
- Check `http://localhost:4000/api/health` to verify backend is running

---

**Need help?** Check the main README.md for detailed troubleshooting.
