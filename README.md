# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project

---

### ✅ `backend/README.md`

```markdown
# Restaurant Task Manager - Backend

This is the backend API for the Restaurant Task Manager (RTM) app, built with Node.js and Express. It handles authentication, email verification, role-based task assignment, image uploads, and secure task tracking.

## Features

- Register/login with email verification
- Role-based access (Manager / Employee)
- Assign and complete tasks with optional photos
- MongoDB + Mongoose for data storage
- JWT-based authentication
- Nodemailer for sending verification emails
- Multer for image uploads
- Environment variable support

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- Nodemailer
- Multer

## Setup Instructions

```bash
# Install dependencies
npm install

# Create a `.env` file

PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_SECRET=email_verification_secret
EMAIL_USERNAME=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_password
BASE_URL=http://localhost:8080

# Run development server
npm run dev
Author

Moustafa Ragheb
GitHub: Mouragheb
