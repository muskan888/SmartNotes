# Kibu Technical Project

This project is a simple note-taking application where users can create, edit, delete, and search notes for different members. It includes authentication for securing API requests, audit logs to track note updates, and a clean, user-friendly UI with Tailwind CSS.

The project is built using Next.js (App Router), React, TypeScript, Tailwind CSS, tRPC, and JSON Server for backend mock data.

## Features Implemented

### Core Functionality
- **List Members & Notes:** Displays a list of users with their respective notes.
- **Create Notes:** Users can add new notes for specific members.
- **Timestamping:** Every note is saved with the exact time it was created.

### Additional Features
- **Edit Notes:** Users can update existing notes; the timestamp is refreshed when a note is edited.
- **Delete Notes:** Users can remove notes from the system.
- **Audit Logging:** Changes made to notes (updates) are tracked. The audit log entries are stored in the `audit_log` array within the `db.json` file and can be viewed there whenever a note is edited.
- **Authentication & Authorization:** JWT-based authentication is implemented to secure API requests.
- **Search Notes:** Users can filter notes in real time using a search bar.
- **Text-to-Speech for Notes:** Users can have their notes read aloud.
- **Unique Note Management:** Ensured that identical note IDs under different users do not conflict.
- **Persistent Login:** JWT tokens are stored in localStorage to maintain authentication across sessions.
- **Tailwind CSS Styling:** The UI is designed with Tailwind CSS for a responsive and interactive experience.

### Tech Stack
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** JSON Server (mock database)
- **API Communication:** tRPC for type-safe API calls
- **Authentication:** JWT-based authentication
- **State Management:** React Hooks (useState, useEffect)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```
### 2. Install Dependencies
```bash
json-server --watch db.json
```
Endpoints:

http://localhost:3000/members
http://localhost:3000/notes

### 3. Run the Development Server
```bash
npm run dev
```
This will start the Next.js application at http://localhost:3000/.

Authentication Guide
## Authentication Guide

The application requires authentication to create, edit, or delete notes.

### Register a User

```sh
curl -X POST http://localhost:3000/api/trpc/auth.register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"securepassword"}'
```
### Login and Get JWT Token

```sh
curl -X POST http://localhost:3000/api/trpc/auth.login \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"securepassword"}'


```

### Store Token in Browser
```sh
localStorage.setItem('token', 'your_generated_jwt_token_here');

```
