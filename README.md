# Quiz Builder — React + Vite

A React quiz management application with separate Admin and Student workspaces. Accounts, quizzes and quiz results are saved in the current browser's Local Storage.

## Requirements

- Node.js LTS (includes npm)
- VS Code or another code editor

## Run the project

Open this folder in VS Code, open Terminal, and run:

```bash
npm install
npm run dev
```

For Windows PowerShell, use these commands if `npm` is blocked by the execution policy:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the localhost address printed by Vite (normally `http://localhost:5173`).

## First-time setup (no demo accounts)

1. Open the app and choose **Create your own account**.
2. Register an Admin account with your real name, email, designation and department.
3. Log out, then register each Student account using that student's real name, email, Student ID, department and year/section.
4. Sign in as Admin. Open **Profiles** in the navigation to see all registered students and admins.
5. Open **My Profile** to view or edit the currently signed-in account details.
6. From the Admin dashboard, create a quiz and publish it. Log in as a Student to attempt the quiz and view results.

The app removes the old built-in Demo Admin, Demo Student, sample quiz and demo submissions when it first opens after this update. Other registered accounts, quizzes and submissions are kept.

## Main functionality

### Admin
- Admin registration and login
- Admin dashboard with quiz, result and account statistics
- Create, edit, publish and delete quizzes
- View all student quiz submissions and review answers
- Search and filter registered Student and Admin profiles
- View and edit the signed-in admin profile

### Student
- Student registration and login
- Student dashboard with published quizzes and personal statistics
- Timed quiz attempts and automatic submission when time expires
- Personal result history and answer review
- View and edit the signed-in student profile

### Profile fields

Student profiles include full name, email, Student ID, department, year/section and optional phone number.
Admin profiles include full name, email, designation, department and optional phone number.

## Build for deployment

```bash
npm run build
```

The production files are generated in the `dist` folder. The included `vercel.json` rewrites page routes to `index.html` for React Router.

## Important project limitation

This is a college demonstration using browser Local Storage, as required by the project brief. The data exists only in the same browser and device. It is not synchronized between different computers or browsers. Local Storage is not secure authentication and stores the demo passwords in the browser; do not use real or reused passwords. A production system should use a backend, database and secure authentication with admin authorization.
