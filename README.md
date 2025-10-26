# 🎯 Freelancer Data Analysis Dashboard

A full-stack MERN application for analyzing freelancer performance, activity metrics, and skill distribution across regions.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Performance Index Formula](#performance-index-formula)
- [Troubleshooting](#troubleshooting)

## 🌟 Overview

This dashboard provides managers with comprehensive analytics to:
- Track freelancer activity (active vs inactive)
- Analyze skill distribution across different countries
- Calculate and rank freelancers by performance index
- Send re-engagement emails to inactive freelancers

## ✨ Features

### 📊 Dashboard 1: Overview
- **Donut Chart**: Visual representation of active vs inactive freelancers
- **Activity Stats**: Total, active, and inactive freelancer counts
- **Inactive Freelancers Table**: List of freelancers inactive for >90 days
- **Email Re-engagement**: Mock EmailJS integration for bulk emailing

### 🗺️ Dashboard 2: Regional Skill Heatmap
- **Skill Distribution Chart**: Country × Skill matrix visualization
- **Top Skills by Country**: Breakdown of most popular skills per region
- **Advanced Filters**: Filter by country and skill
- **Summary Statistics**: Total countries, skills, and combinations

### 🏆 Dashboard 3: Performance Index
- **Top 10 Performers**: Bar chart of highest-performing freelancers
- **Performance Metrics Table**: Detailed ranking with all metrics
- **Performance Tiers**: Excellent, Good, Average, Needs Improvement
- **Search & Filter**: By name, country, and skill

### 👥 All Freelancers
- **Complete List**: Grid view of all registered freelancers
- **Advanced Filtering**: Search, country, skill, and status filters
- **Quick Stats**: Summary cards for total, active, and inactive counts

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (with Mongoose ODM)
- **JWT** - Authentication
- **Faker.js** - Demo data generation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Chart.js** - Additional charts
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## 📁 Project Structure

```
frelancer/
├── backend/
│   ├── scripts/
│   │   └── seed.js                 # Database seeding script
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # MongoDB connection
│   │   ├── controllers/
│   │   │   └── freelancerController.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── logger.js
│   │   ├── models/
│   │   │   └── Freelancer.js       # Mongoose schema
│   │   ├── routes/
│   │   │   └── freelancerRoutes.js
│   │   ├── utils/
│   │   │   └── analytics.js        # Performance calculations
│   │   └── server.js               # Express app entry
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── StatCard.jsx
│   │   ├── pages/
│   │   │   ├── FreelancersList.jsx
│   │   │   ├── OverviewDashboard.jsx
│   │   │   ├── PerformanceDashboard.jsx
│   │   │   └── SkillHeatmap.jsx
│   │   ├── services/
│   │   │   └── api.js              # Axios configuration
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

## 📦 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB Atlas Account** - [Sign up free](https://www.mongodb.com/cloud/atlas)
- **Git** (optional) - [Download](https://git-scm.com/)

## 🚀 Installation

### Step 1: Install Backend Dependencies

Open PowerShell and navigate to the backend folder:

```powershell
cd c:\Users\HP\Desktop\frelancer\backend
npm install
```

### Step 2: Install Frontend Dependencies

```powershell
cd c:\Users\HP\Desktop\frelancer\frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. **Copy the environment template:**

```powershell
cd c:\Users\HP\Desktop\frelancer\backend
cp .env.example .env
```

2. **Edit `.env` file** with your credentials:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/freelancer_analytics?retryWrites=true&w=majority

# Server Configuration
PORT=4000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production_min_32_chars
JWT_EXPIRE=7d

# EmailJS Configuration (Optional - for email features)
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend Configuration

1. **Copy the environment template:**

```powershell
cd c:\Users\HP\Desktop\frelancer\frontend
cp .env.example .env
```

2. **Edit `.env` file:**

```env
VITE_API_URL=http://localhost:4000/api
```

## 🎮 Running the Application

### Method 1: Run Separately (Recommended for Development)

**Terminal 1 - Backend:**

```powershell
cd c:\Users\HP\Desktop\frelancer\backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.mongodb.net
🚀 Server running in development mode
🌐 Server URL: http://localhost:4000
```

**Terminal 2 - Seed Database (First time only):**

```powershell
cd c:\Users\HP\Desktop\frelancer\backend
npm run seed
```

You should see:
```
🌱 Starting database seed...
✅ Successfully created 50 freelancers
📊 SEED SUMMARY
```

**Terminal 3 - Frontend:**

```powershell
cd c:\Users\HP\Desktop\frelancer\frontend
npm run dev
```

You should see:
```
  VITE v5.0.0  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Method 2: Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

## 📡 API Endpoints

### Freelancers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/freelancers` | Get all freelancers (with filters) |
| GET | `/api/freelancers/:id` | Get single freelancer |
| POST | `/api/freelancers` | Create new freelancer |
| PUT | `/api/freelancers/:id` | Update freelancer |
| DELETE | `/api/freelancers/:id` | Delete freelancer |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/freelancers/analytics` | Get comprehensive analytics |
| POST | `/api/freelancers/reactivate` | Send re-engagement emails |
| GET | `/api/freelancers/filters/countries` | Get all countries |
| GET | `/api/freelancers/filters/skills` | Get all skills |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health status |

## 📸 Screenshots

### Overview Dashboard
- Donut chart showing active/inactive distribution
- Stats cards with key metrics
- Inactive freelancers table with email functionality

### Skill Heatmap
- Bar chart of skill distribution by country
- Top skills breakdown per region
- Advanced filtering options

### Performance Dashboard
- Top 10 performers bar chart
- Detailed performance metrics table
- Performance tiers and rankings

## 🧮 Performance Index Formula

The performance index is calculated using the following formula:

```javascript
PerformanceIndex = 0.6 × (rating / 5)
                 + 0.3 × recencyScore
                 + 0.1 × normalizedProjects

where:
  recencyScore = 1 / (1 + daysInactive)
  normalizedProjects = projectsWorked / maxProjects
```

**Weights:**
- **60%** - Rating (1-5 scale)
- **30%** - Recency (how recently active)
- **10%** - Project volume

**Performance Tiers:**
- **Excellent**: ≥80%
- **Good**: 60-79%
- **Average**: 40-59%
- **Needs Improvement**: <40%

## 🐛 Troubleshooting

### MongoDB Connection Error

**Problem:** `MongoNetworkError` or connection timeout

**Solution:**
1. Check your MongoDB URI in `.env`
2. Ensure your IP is whitelisted in MongoDB Atlas
3. Verify your username/password are correct

### Port Already in Use

**Problem:** `EADDRINUSE: address already in use`

**Solution:**

```powershell
# Kill process on port 4000
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### CORS Error

**Problem:** `Access-Control-Allow-Origin` error

**Solution:**
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Default should be `http://localhost:3000`

### Seed Script Fails

**Problem:** Error during database seeding

**Solution:**
1. Ensure MongoDB is connected
2. Check your `MONGO_URI` is correct
3. Try clearing the database first:

```javascript
// In MongoDB Atlas, drop the collection and re-run seed
```

### Charts Not Rendering

**Problem:** Blank charts or console errors

**Solution:**
1. Clear browser cache
2. Check console for specific errors
3. Ensure data is loading (check Network tab)
4. Verify API is returning data

## 🎓 Development Commands

### Backend

```powershell
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Seed database with demo data
npm run seed
```

### Frontend

```powershell
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Environment Variables Reference

### Backend (.env)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| MONGO_URI | ✅ | MongoDB connection string | `mongodb+srv://...` |
| PORT | ❌ | Server port | `4000` |
| NODE_ENV | ❌ | Environment | `development` |
| JWT_SECRET | ✅ | JWT signing secret | `your_secret_key` |
| JWT_EXPIRE | ❌ | Token expiration | `7d` |
| EMAILJS_SERVICE_ID | ❌ | EmailJS service ID | `service_xyz` |
| EMAILJS_TEMPLATE_ID | ❌ | EmailJS template ID | `template_xyz` |
| EMAILJS_PUBLIC_KEY | ❌ | EmailJS public key | `key_xyz` |
| FRONTEND_URL | ❌ | Frontend URL for CORS | `http://localhost:3000` |

### Frontend (.env)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| VITE_API_URL | ❌ | Backend API URL | `http://localhost:4000/api` |

## 🤝 Features Roadmap

- [ ] Real EmailJS integration
- [ ] User authentication and authorization
- [ ] Export data to CSV/PDF
- [ ] Advanced filtering and sorting
- [ ] Real-time notifications
- [ ] Dark mode toggle
- [ ] Mobile responsive improvements

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer Notes

- All passwords and sensitive data should be stored in `.env` files
- Never commit `.env` files to version control
- Use `.env.example` as a template for required variables
- The seed script generates 50 demo freelancers automatically
- Performance calculations are handled server-side for consistency

## 🎉 Success Checklist

- [x] Backend server running on port 4000
- [x] Frontend running on port 3000
- [x] MongoDB connected successfully
- [x] Database seeded with 50 demo freelancers
- [x] All dashboards rendering with data
- [x] Charts displaying correctly
- [x] Filters working properly
- [x] API endpoints responding

---

**Built with ❤️ using the MERN Stack**

For issues or questions, please check the troubleshooting section above.
