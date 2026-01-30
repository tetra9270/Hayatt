# High-Performance 3D E-Commerce Platform

## Project Overview
- **Client**: Next.js 14+, Tailwind CSS, Framer Motion, Three.js
- **Server**: Node.js, Express, MongoDB

## How to Run the Project

You need **two** separate terminal windows.

### 1. Start the Backend (Server)
This handles the API, Database, and Authentication.
```bash
cd server
npm run dev
```
> Server will run at: `http://localhost:5000`

### 2. Start the Frontend (Client)
This runs the User Interface.
```bash
cd client
npx next start -p 8080
```
> Frontend will run at: `http://localhost:8080`

**Note**: We use port `8080` and `next start` (Production mode) because it is more stable than the default dev server in this environment.

## Credentials
- **MongoDB**: Ensure your `server/.env` has the correct `MONGO_URI`.
- **Login**: You can create a new account properly via the Register page.
