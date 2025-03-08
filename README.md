# NoteSync Pro - Secure Note Management System

A comprehensive, secure note-taking application that enables team collaboration with advanced features for creating, editing, and tracking notes across multiple users.

## 🔑 Key Features

### Core Functionality
- **Member-Based Organization:** Organize notes by team members for better collaboration
- **Real-Time Note Management:** Create, edit, and delete notes with immediate updates
- **Precise Timestamping:** Every note is tracked with exact creation and modification times

### Security & Privacy
- **Password-Protected Notes:** Access control ensures users can only view their authorized notes
- **JWT Authentication:** Secure API requests with token-based authentication
- **Comprehensive Audit Logging:** Track all note modifications with detailed audit trails

### User Experience
- **Responsive UI:** Clean, modern interface built with Tailwind CSS
- **Real-Time Search:** Instantly filter notes as you type
- **Accessibility Features:** Text-to-speech functionality for note content
- **Persistent Sessions:** Stay logged in across browser sessions

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** JSON Server (mock database)
- **API Communication:** tRPC for type-safe API calls
- **Authentication:** JWT-based authentication
- **State Management:** React Context and Hooks

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the JSON Server

```bash
json-server --watch db.json --port 3001
```

Available endpoints:
- http://localhost:3001/members
- http://localhost:3001/notes
- http://localhost:3001/audit_log (Tracks note updates)

### 3. Run the Development Server

```bash
npm run dev
```

This will start the Next.js application at http://localhost:3000/

## 🔐 Authentication Guide

The application requires authentication to create, edit, or delete notes.

### Register a User

```bash
curl -X POST http://localhost:3000/api/trpc/auth.register \
     -H "Content-Type: application/json" \
     --data-raw '{"username":"testuser","password":"securepassword"}'
```

### Login and Get JWT Token

```bash
curl -X POST http://localhost:3000/api/trpc/auth.login \
     -H "Content-Type: application/json" \
     --data-raw '{"username":"testuser","password":"securepassword"}'
```

### Store Token in Browser

```javascript
localStorage.setItem('token', 'your_generated_jwt_token_here');
```

## 📝 Development Notes

- Note IDs are managed to prevent conflicts between different users
- JWT tokens are stored in localStorage for session persistence
- Audit logs capture all note modifications and are stored in the `db.json` file
