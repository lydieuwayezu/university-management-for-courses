# University Course Management Interface

A professional frontend web application built with **React** and **Tailwind CSS** that allows a university supervisor to manage courses via a RESTful API.

---

## Live Demo

> Deploy link goes here after deployment (e.g. Vercel / Netlify)

---

## How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>

# 2. Navigate into the project folder
cd my-project

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Then open your browser and go to: **http://localhost:5173**

### Login Credentials
```
Email:    admin@example.com
Password: adminpassword123
```

---

## Project Structure

```
my-project/
├── public/
│   └── favicon.svg           # Browser tab icon
│
├── src/
│   ├── components/
│   │   ├── Login.jsx         # Login page with email/password form
│   │   ├── Dashboard.jsx     # Main page: lists all courses, search, CRUD actions
│   │   ├── CourseForm.jsx    # Modal form for creating and editing a course
│   │   └── CourseDetail.jsx  # Modal that shows full details of a single course
│   │
│   ├── api.js                # All API calls to the backend (login, CRUD)
│   ├── App.jsx               # Root component: handles auth state and routing
│   ├── App.css               # Empty (Tailwind handles all styles)
│   ├── index.css             # Tailwind CSS import
│   └── main.jsx              # React app entry point
│
├── index.html                # HTML shell that loads the React app
├── vite.config.js            # Vite + Tailwind plugin configuration

├── package.json              # Project dependencies and scripts
└── README.md                 # This file
```

---

## How It Works

### Authentication Flow
1. When the app loads, `App.jsx` checks `localStorage` for a saved token.
2. If no token is found, the **Login** page is shown.
3. On successful login, the JWT token returned by the API is saved to `localStorage` and the user is taken to the **Dashboard**.
4. Clicking **Logout** clears the token from `localStorage` and returns to the Login page.

### API Layer (`src/api.js`)
All communication with the backend lives in one file. Each function:
- Sends an HTTP request to `https://student-management-system-backend.up.railway.app/api`
- Attaches the JWT token in the `Authorization: Bearer <token>` header (except login)
- Throws an error with the server's message if the response is not OK

| Function | Method | Endpoint | Purpose |
|---|---|---|---|
| `login` | POST | `/auth/login` | Authenticate and get token |
| `getCourses` | GET | `/courses` | Fetch all courses |
| `getCourse` | GET | `/courses/:id` | Fetch one course by ID |
| `createCourse` | POST | `/courses` | Add a new course |
| `updateCourse` | PUT | `/courses/:id` | Edit an existing course |
| `deleteCourse` | DELETE | `/courses/:id` | Remove a course |

---

## Component Breakdown

### `App.jsx`
- The root of the app.
- Holds the `token` state.
- Renders `<Login>` if no token, or `<Dashboard>` if authenticated.
- Passes `onLogin` and `onLogout` handlers down as props.

### `Login.jsx`
- Simple form with email and password fields.
- Calls `login()` from `api.js` on submit.
- Shows an error message if login fails.
- Shows a loading state while the request is in progress.

### `Dashboard.jsx`
- Fetches and displays all courses in a responsive card grid.
- Has a **search bar** to filter courses by name, code, department, or instructor.
- Each course card has three actions: **View**, **Edit**, **Delete**.
- **Add Course** button opens the `CourseForm` modal.
- **View** fetches the course by ID and opens the `CourseDetail` modal.
- **Edit** opens the `CourseForm` modal pre-filled with the course data.
- **Delete** opens a confirmation dialog before calling the delete API.
- Shows a **toast notification** (bottom-right) for success or error feedback.
- Shows a **loading spinner** while fetching data.

### `CourseForm.jsx`
- A modal form used for both **creating** and **editing** a course.
- When `course` prop is passed, it pre-fills the form fields (edit mode).
- When no `course` prop is passed, it starts with empty fields (create mode).
- Fields: Course Code, Course Name, Description, Credits, Department, Instructor.
- Calls `createCourse` or `updateCourse` from `api.js` on submit.

### `CourseDetail.jsx`
- A read-only modal that displays all details of a single course.
- Receives the full course object as a prop and renders it in a clean grid layout.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Tailwind CSS v4 | Styling |
| Vite | Build tool and dev server |
| Fetch API | HTTP requests to the backend |

---

## Available Scripts

```bash
npm run dev       # Start development server at localhost:5173
npm run build     # Build for production (outputs to /dist)
npm run preview   # Preview the production build locally
```

---

## API Reference

Backend Swagger Docs: [https://student-management-system-backend.up.railway.app/api-docs/](https://student-management-system-backend.up.railway.app/api-docs/)
