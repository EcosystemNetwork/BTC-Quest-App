# Minimal Wallet Connect Project

This project is a stripped-down template for connecting a crypto wallet, ready for Vercel deployment and Neon DB integration. It includes a development mode that does not require a database connection for wallet connection.

## Features
- React frontend with generic wallet connect
- Node.js/Express backend (API route for wallet, DB connection only in production)
- Vercel deployment ready
- Neon DB integration (production only)
- Development mode: no DB required for wallet connect

## Getting Started

### 1. Install dependencies
```
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in values as needed.

### 3. Development
```
npm run dev
```

### 4. Production/Deploy
Deploy to Vercel. Ensure Neon DB credentials are set in environment variables.

## Folder Structure
- `/src` - React frontend
- `/api` - Express backend (API routes)
- `/public` - Static assets

## Environment Variables
See `.env.example` for required variables.

---

Replace this README as you build your project.