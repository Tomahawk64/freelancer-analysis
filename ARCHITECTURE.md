# 📊 Project Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                     http://localhost:3000                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                       │
├─────────────────────────────────────────────────────────────────┤
│  Components Layer                                                │
│  ├── Sidebar.jsx         (Navigation)                           │
│  ├── Navbar.jsx          (Top bar with refresh)                 │
│  ├── StatCard.jsx        (Reusable stat display)                │
│  ├── LoadingSpinner.jsx  (Loading states)                       │
│  └── ErrorMessage.jsx    (Error handling)                       │
│                                                                  │
│  Pages Layer                                                     │
│  ├── OverviewDashboard.jsx    (Active/Inactive + Email)         │
│  ├── SkillHeatmap.jsx         (Regional skill distribution)     │
│  ├── PerformanceDashboard.jsx (Performance rankings)            │
│  └── FreelancersList.jsx      (All freelancers grid)            │
│                                                                  │
│  Services Layer                                                  │
│  └── api.js (Axios - API integration)                           │
│                                                                  │
│  Styling                                                         │
│  └── TailwindCSS + Custom CSS                                   │
│                                                                  │
│  Visualization                                                   │
│  ├── Chart.js (Donut charts)                                    │
│  └── Recharts (Bar charts)                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ REST API Calls
                             │ (Axios)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js + Express)                     │
│                     http://localhost:4000                        │
├─────────────────────────────────────────────────────────────────┤
│  Routes Layer                                                    │
│  └── freelancerRoutes.js                                        │
│      ├── GET    /api/freelancers                                │
│      ├── GET    /api/freelancers/:id                            │
│      ├── POST   /api/freelancers                                │
│      ├── PUT    /api/freelancers/:id                            │
│      ├── DELETE /api/freelancers/:id                            │
│      ├── GET    /api/freelancers/analytics                      │
│      ├── POST   /api/freelancers/reactivate                     │
│      ├── GET    /api/freelancers/filters/countries              │
│      └── GET    /api/freelancers/filters/skills                 │
│                                                                  │
│  Controllers Layer                                               │
│  └── freelancerController.js                                    │
│      ├── getAllFreelancers()                                    │
│      ├── getFreelancerById()                                    │
│      ├── createFreelancer()                                     │
│      ├── updateFreelancer()                                     │
│      ├── deleteFreelancer()                                     │
│      ├── getAnalytics()                                         │
│      ├── reactivateFreelancers()                                │
│      ├── getCountries()                                         │
│      └── getSkills()                                            │
│                                                                  │
│  Models Layer                                                    │
│  └── Freelancer.js (Mongoose Schema)                            │
│      ├── Fields: name, email, country, skill, etc.              │
│      ├── Virtuals: daysInactive, isActive                       │
│      ├── Methods: calculatePerformanceIndex()                   │
│      └── Statics: getAnalyticsSummary()                         │
│                                                                  │
│  Utils Layer                                                     │
│  └── analytics.js                                               │
│      ├── calculateDaysInactive()                                │
│      ├── calculatePerformanceIndex()                            │
│      ├── getSkillDistributionByCountry()                        │
│      ├── getActivitySummary()                                   │
│      └── getTopPerformers()                                     │
│                                                                  │
│  Middleware Layer                                                │
│  ├── errorHandler.js (Global error handling)                    │
│  └── logger.js (Request logging)                                │
│                                                                  │
│  Config Layer                                                    │
│  └── database.js (MongoDB connection)                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Mongoose ODM
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB Atlas)                      │
├─────────────────────────────────────────────────────────────────┤
│  Database: freelancer_analytics                                  │
│  │                                                               │
│  └── Collection: freelancers                                     │
│      ├── Document 1 (Freelancer)                                │
│      ├── Document 2 (Freelancer)                                │
│      ├── ...                                                     │
│      └── Document 50 (Freelancer)                               │
│                                                                  │
│  Indexes:                                                        │
│  ├── email (unique)                                             │
│  ├── country + skill (compound)                                 │
│  └── lastActive (sorted queries)                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Page Load Flow (Overview Dashboard)

```
User Opens Browser
       │
       ▼
React App Loads (main.jsx)
       │
       ▼
App.jsx Initializes Router
       │
       ▼
OverviewDashboard.jsx Mounts
       │
       ▼
useEffect() Triggers
       │
       ▼
fetchAnalytics() Called
       │
       ▼
api.get('/freelancers/analytics')
       │
       ▼
Backend: getAnalytics() Controller
       │
       ├──> Fetch all freelancers from MongoDB
       │
       ├──> Calculate performance metrics
       │    └─> For each freelancer:
       │        ├─> calculateDaysInactive()
       │        ├─> calculatePerformanceIndex()
       │        └─> isActive status
       │
       ├──> Generate skill distribution
       │    └─> Group by country × skill
       │
       ├──> Get activity summary
       │    └─> Count active vs inactive
       │
       └──> Return JSON response
       │
       ▼
Frontend Receives Data
       │
       ├──> setAnalytics(data)
       ├──> Render Donut Chart
       ├──> Render Stats Cards
       └──> Render Inactive Table
       │
       ▼
User Sees Dashboard
```

### 2. Email Reactivation Flow

```
User Selects Inactive Freelancers
       │
       ├─> Checkbox click
       ├─> Add to selectedFreelancers[]
       └─> Update UI
       │
       ▼
User Clicks "Send Email" Button
       │
       ▼
handleSendEmails() Called
       │
       ├─> Validate selection (length > 0)
       └─> setSendingEmails(true)
       │
       ▼
api.post('/freelancers/reactivate', { freelancerIds })
       │
       ▼
Backend: reactivateFreelancers() Controller
       │
       ├──> Fetch freelancers by IDs
       ├──> Mock EmailJS call
       └──> Return success response
       │
       ▼
Frontend Receives Response
       │
       ├──> Show success toast
       ├──> Clear selections
       └──> setSendingEmails(false)
       │
       ▼
User Sees Success Notification
```

### 3. Filter Flow (Any Dashboard)

```
User Selects Filter
       │
       ▼
onChange Event Triggered
       │
       ├─> setFilterCountry(value)
       ├─> setFilterSkill(value)
       └─> setSearchTerm(value)
       │
       ▼
Component Re-renders
       │
       ▼
filteredData Computed
       │
       ├──> Apply search filter
       │    └─> name.includes(searchTerm)
       │
       ├──> Apply country filter
       │    └─> country === filterCountry
       │
       └──> Apply skill filter
            └─> skill === filterSkill
       │
       ▼
Charts/Tables Update
       │
       ▼
User Sees Filtered Results
```

---

## Performance Index Calculation Flow

```
Input: Freelancer Document
       │
       ├─> rating (1-5)
       ├─> lastActive (Date)
       ├─> projectsWorked (Number)
       └─> maxProjects (from all freelancers)
       │
       ▼
Step 1: Calculate daysInactive
       │
       └─> daysInactive = (today - lastActive) / (1000*60*60*24)
       │
       ▼
Step 2: Calculate normalizedRating
       │
       └─> normalizedRating = rating / 5
       │    Example: 4.5 / 5 = 0.9
       │
       ▼
Step 3: Calculate recencyScore
       │
       └─> recencyScore = 1 / (1 + daysInactive)
       │    Example: 1 / (1 + 30) = 0.0323
       │
       ▼
Step 4: Calculate normalizedProjects
       │
       └─> normalizedProjects = projectsWorked / maxProjects
       │    Example: 45 / 100 = 0.45
       │
       ▼
Step 5: Apply Formula
       │
       └─> performanceIndex = 
           (0.6 × normalizedRating) +
           (0.3 × recencyScore) +
           (0.1 × normalizedProjects)
       │
       │    Example:
       │    = (0.6 × 0.9) + (0.3 × 0.0323) + (0.1 × 0.45)
       │    = 0.54 + 0.00969 + 0.045
       │    = 0.5947 (59.47%)
       │
       ▼
Output: Performance Index (0-1 scale)
       │
       └─> Tier Assignment:
           ├─> ≥0.8 = Excellent
           ├─> 0.6-0.79 = Good
           ├─> 0.4-0.59 = Average
           └─> <0.4 = Needs Improvement
```

---

## File Dependencies Map

```
Backend Dependencies:
server.js
  ├── config/database.js → mongoose
  ├── routes/freelancerRoutes.js
  │   └── controllers/freelancerController.js
  │       ├── models/Freelancer.js → mongoose
  │       └── utils/analytics.js
  ├── middleware/errorHandler.js
  └── middleware/logger.js

Frontend Dependencies:
main.jsx
  └── App.jsx
      ├── components/
      │   ├── Sidebar.jsx → react-router-dom
      │   ├── Navbar.jsx → lucide-react
      │   ├── StatCard.jsx → lucide-react
      │   ├── LoadingSpinner.jsx → lucide-react
      │   └── ErrorMessage.jsx → lucide-react
      ├── pages/
      │   ├── OverviewDashboard.jsx
      │   │   ├── services/api.js → axios
      │   │   ├── chart.js → react-chartjs-2
      │   │   └── react-hot-toast
      │   ├── SkillHeatmap.jsx
      │   │   ├── services/api.js → axios
      │   │   └── recharts
      │   ├── PerformanceDashboard.jsx
      │   │   ├── services/api.js → axios
      │   │   └── recharts
      │   └── FreelancersList.jsx
      │       └── services/api.js → axios
      └── services/api.js → axios
```

---

## Component Hierarchy

```
<App>
  │
  ├── <Router>
  │   │
  │   ├── <Sidebar>
  │   │   ├── Logo
  │   │   ├── Navigation Menu
  │   │   │   ├── Overview Link
  │   │   │   ├── Heatmap Link
  │   │   │   ├── Performance Link
  │   │   │   └── Freelancers Link
  │   │   └── Footer
  │   │
  │   ├── <Navbar>
  │   │   ├── Menu Button (mobile)
  │   │   ├── Title
  │   │   └── Refresh Button
  │   │
  │   └── <Routes>
  │       │
  │       ├── / → <OverviewDashboard>
  │       │        ├── <StatCard> × 4
  │       │        ├── <Doughnut> (Chart.js)
  │       │        └── <Table> (Inactive)
  │       │
  │       ├── /heatmap → <SkillHeatmap>
  │       │              ├── Filter Dropdowns
  │       │              ├── <BarChart> (Recharts)
  │       │              └── Top Skills Grid
  │       │
  │       ├── /performance → <PerformanceDashboard>
  │       │                  ├── <StatCard> × 3
  │       │                  ├── Filter Controls
  │       │                  ├── <BarChart> (Recharts)
  │       │                  └── <Table> (Performance)
  │       │
  │       └── /freelancers → <FreelancersList>
  │                          ├── <StatCard> × 4
  │                          ├── Filter Controls
  │                          └── Cards Grid
  │
  └── <Toaster> (react-hot-toast)
```

---

## API Request/Response Examples

### GET /api/freelancers/analytics

**Response:**
```json
{
  "success": true,
  "data": {
    "activitySummary": {
      "total": 50,
      "active": 15,
      "inactive": 35,
      "activePercentage": "30.00",
      "inactivePercentage": "70.00"
    },
    "skillDistribution": {
      "United States": {
        "Web Development": 5,
        "UI/UX Design": 3
      },
      "India": {
        "Data Analysis": 4,
        "Mobile Development": 2
      }
    },
    "performanceMetrics": [
      {
        "id": "...",
        "name": "John Doe",
        "country": "United States",
        "skill": "Web Development",
        "rating": 4.5,
        "projectsWorked": 45,
        "lastActive": "2024-10-15T...",
        "daysInactive": 11,
        "isActive": true,
        "performanceIndex": 0.8234
      }
    ],
    "inactiveFreelancers": [...],
    "topPerformers": [...]
  }
}
```

---

## Security Flow

```
Request from Browser
       │
       ▼
CORS Middleware Check
       │ ✓ Origin allowed
       ▼
Request Logger
       │ Log: method, path, timestamp
       ▼
Route Handler
       │ Execute controller
       ▼
Input Validation
       │ Mongoose schema validation
       ▼
Database Operation
       │ Sanitized query
       ▼
Error Handler (if error)
       │ Format error, hide sensitive data
       ▼
Response to Browser
       │ JSON with success/error
       ▼
Frontend Error Handler
       │ Display user-friendly message
       ▼
User Sees Result
```

---

## Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────────┐
│                   Domain (Custom)                        │
│              www.freelancer-analytics.com                │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              CDN / Static Hosting                        │
│         (Netlify, Vercel, GitHub Pages)                 │
│                                                          │
│         Frontend Build (dist/)                           │
│         - HTML, CSS, JS bundles                         │
│         - Optimized assets                              │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ API Calls
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Backend Server                              │
│         (Render, Heroku, Railway)                       │
│                                                          │
│         Node.js + Express API                           │
│         - Environment variables                          │
│         - Logging & monitoring                          │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ MongoDB connection
                        ▼
┌─────────────────────────────────────────────────────────┐
│              MongoDB Atlas                               │
│         (Cloud Database)                                 │
│                                                          │
│         - Automatic backups                             │
│         - Scaling                                       │
│         - Security                                      │
└─────────────────────────────────────────────────────────┘
```

---

This architecture ensures:
- ✅ Separation of concerns
- ✅ Scalability
- ✅ Maintainability
- ✅ Security
- ✅ Performance
- ✅ Developer experience
