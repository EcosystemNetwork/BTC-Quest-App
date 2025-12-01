# BTC Quest App

A task rewards application built with React where users can complete tasks and earn points/rewards. Complete various tasks to earn points, unlock achievements, and redeem exclusive rewards.

## Features

- 📋 **Task System**: Complete various tasks to earn points
- 🏆 **Achievements**: Unlock achievements based on your progress
- 🎁 **Rewards Store**: Redeem points for exclusive rewards
- 📈 **Level Progression**: Level up as you accumulate points
- 🔥 **Streak System**: Maintain daily login streaks for bonus rewards
- 💾 **Local Persistence**: Progress saved automatically in browser storage
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Task Categories

- **Onboarding**: Get started with the platform
- **Daily**: Recurring daily tasks
- **Social**: Share and invite friends
- **Transactions**: Complete platform transactions
- **Learning**: Educational content and quizzes
- **Security**: Secure your account
- **Milestones**: Long-term achievement goals

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in values as needed.

### 3. Development
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

### 5. Production/Deploy
Deploy to Vercel. Ensure Neon DB credentials are set in environment variables for production database support.

## Folder Structure

- `/src` - React frontend
  - `/components` - React components
  - `/data` - Task and achievement data
- `/api` - Express backend (API routes)
- `/public` - Static assets

## Environment Variables

See `.env.example` for required variables.

## Tech Stack

- **Frontend**: React 18, Vite
- **Backend**: Node.js, Express
- **Styling**: CSS with custom properties
- **State Management**: React hooks with localStorage persistence
- **Deployment**: Vercel-ready