# CivicFix

CivicFix is a full-stack local civic issue reporting and tracking system for citizens and administrators. Citizens can report public problems, support existing reports, add comments, track admin responses, and give feedback after resolution. Admins can manage reports, update status, write official responses, and prioritize high-impact issues.

## Features

- Citizen and admin authentication
- Role-based access control
- Citizen issue reporting
- Duplicate active issue prevention
- Auto category suggestion from issue description
- Public issue board with search and filters
- My Reports page for citizens
- Admin panel for status updates and official responses
- In-app notifications for admin updates
- One-time support/upvote per citizen
- Priority score based on public support
- Community comments on issues
- Feedback and rating after issue resolution
- Dashboard with summary cards and high-priority queue

## Tech Stack

- Frontend: React, Vite, React Router, Axios, CSS
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: JWT, bcryptjs

## Folder Structure

```text
CivicFix/
  backend/
    models/
    routes/
    middleware/
    server.js
  frontend/
    src/
      pages/
      App.jsx
      App.css
```

## Setup

### Backend

```powershell
cd backend
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Environment Variables

Create `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/civicfix
JWT_SECRET=civicfixsecret
ADMIN_CODE=civicfixadmin
CLIENT_URL=http://localhost:5173
PORT=5000
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

## Demo Accounts

You can register a normal citizen directly from the Register page.

To register an admin, choose Admin role and use:

```text
civicfixadmin
```

## Resume Summary

Built a MERN-based civic issue reporting platform with role-based authentication, duplicate complaint prevention, public upvoting, priority scoring, admin workflow management, in-app notifications, comments, and citizen feedback.

## Deployment Plan

Use this setup to make CivicFix available globally:

1. Push the project to GitHub.
2. Create a MongoDB Atlas database and copy the Atlas connection string.
3. Deploy the backend on a Node hosting service such as Render.
4. Add backend environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `ADMIN_CODE`
   - `CLIENT_URL`
   - `PORT`
5. Deploy the frontend on a static hosting service such as Vercel.
6. Add frontend environment variable:
   - `VITE_API_URL`
7. Set `CLIENT_URL` in the backend to the final frontend domain.
8. Open the frontend domain and test citizen/admin workflows.

## Installable App

CivicFix includes a web app manifest and service worker, so it can be installed from supported browsers as a Progressive Web App.
