# Taskflow — Smart Task Management App

A role-based task collaboration web application built with **React 19**, **TypeScript**, **Firebase**, and **Tailwind CSS**. Admins create and assign tasks; team members track and update their own work — all in real time.

🔗 **Live Demo:** [https://taskflow-apps.vercel.app/]

---

## Tech Stack

| Category | Technology |
|---|---|
| Frontend | React 19, TypeScript 5.9 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS 3, lucide-react, react-icons |
| Forms | react-hook-form + yup |
| State | Context API + custom hooks |
| Backend | Firebase Auth + Cloud Firestore |
| Notifications | react-hot-toast |
| Build | Vite 8 |
| Deployment | Vercel |

---

## Features

### Admin
- Create, edit, and delete tasks with title, description, priority, and dates
- Assign tasks to any registered user
- Verify completed tasks and mark them as **Done**
- View all tasks across the team with status breakdown
- Manage users — update roles, remove members
- Dashboard with team stats, top assignees, task breakdown, recent tasks

### User
- View only tasks assigned to them
- Update task status: `Todo → In Progress → Completed`
- Add start date, end date, and remarks
- Personal dashboard with completion rate and upcoming deadlines
- Edit profile name and password

### General
- Firebase Authentication (login, signup, forgot password)
- Protected routes — unauthenticated users redirected to login
- Real-time Firestore data sync
- Toast notifications for all actions
- Full dark mode support
- Fully responsive — mobile and desktop

---

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Login.tsx
│   ├── SignUp.tsx
│   ├── ForgotPassword.tsx
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Navbar.tsx
│   ├── TaskCard.tsx
│   ├── TaskForm.tsx
│   ├── TaskFormModal.tsx
│   ├── TaskList.tsx
│   ├── UserTaskModal.tsx
│   ├── Modal.tsx
│   ├── ProfileDropdown.tsx
│   ├── ProtectedRoute.tsx
│   ├── Card.tsx
│   └── FullScreenState.tsx
├── context/
│   └── AuthContext.tsx   # Firebase auth state + user role
├── hooks/
│   ├── useAuth.ts        # Auth context consumer
│   ├── useTasks.ts       # Task CRUD + role-based fetching
│   └── useUsers.ts       # User management
├── layout/
│   └── MainLayout.tsx    # Sidebar + Header shell
├── pages/
│   ├── Dashboard.tsx     # Role-specific dashboard
│   ├── Tasks.tsx         # Task list + management
│   ├── UserManagement.tsx
│   ├── Profile.tsx
│   ├── AuthLayout.tsx
│   ├── ConfirmModal.tsx
│   └── NotFound.tsx
├── services/
│   ├── firebase.ts       # Firebase app init
│   ├── taskService.ts    # Firestore task CRUD
│   └── userService.ts    # Firestore user CRUD
├── types/
│   ├── tasks.ts          # Task interface
│   ├── auth.ts           # UserData, Role, form types
│   └── profile.ts
├── utils/
│   ├── firebaseError.ts  # Error message mapper
│   └── validation.ts     # Yup schemas
├── router.tsx            # All routes
├── App.tsx
└── main.tsx
```

---

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/kannan-frontend/smart-task-management.git
cd smart-task-management

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)

# 4. Start the dev server
npm run dev
```

