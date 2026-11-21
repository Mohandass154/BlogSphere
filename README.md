# 🌐 BlogSphere

> A simple, modern, lightweight, and fully functional blogging platform built with the MERN stack (MongoDB, Express, React + Vite, Node.js) and JWT Authentication.

---

## ✨ Features

### 1. Authentication
- **User Registration**: Create an account with name, email, password, and optional bio.
- **User Login & Logout**: Secure JWT-based authentication stored in `localStorage` and managed with React Context.
- **Secure Password Hashing**: Passwords encrypted using `bcryptjs` with salt rounds.
- **Demo Accounts**: Instant 1-click test login for quick evaluation.

### 2. Blog Posts
- **Explore & Read**: Browse published blog posts with cover images, category badges, author avatars, and reading time estimates.
- **Search & Filters**: Real-time keyword search and category filtering (Technology, Backend, Design, Productivity, General).
- **Create Blog**: Write and publish rich articles with titles, custom cover images (with live preview), excerpts, and content.
- **Edit Blog**: Post authors can edit their own posts. Unauthorized users are blocked on both client and API levels.
- **Delete Blog**: Authors can delete their own posts with a safety confirmation modal. Associated comments are cleaned up automatically.
- **Individual Post Page**: Full-screen article view with author biography, formatted paragraphs, and interactive comments.

### 3. Comments
- **Community Engagement**: Authenticated users can leave comments on any published blog post.
- **Author Ownership**: Users can delete their own comments. Non-owners cannot delete other users' comments.
- **Guest Prompts**: Clear, helpful prompt encouraging visitors to log in or register before commenting.

### 4. Design & UI/UX
- **Modern Minimalist Aesthetic**: Indigo and slate color palette, clean cards, subtle hover elevations, and responsive typography.
- **Navigation**: Sticky header with logo, links, user initials avatar, and quick write button.
- **Fully Responsive**: Optimized for both mobile devices (with mobile drawer menu) and large desktop monitors.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router 7, Lucide Icons, Pure Modern CSS.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (supports **MongoDB Atlas** connection string, with an automatic in-memory MongoDB fallback for instant zero-configuration local runs).
- **Security**: JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS.

---

## 📂 Project Structure

```text
BlogSphere/
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB connection (Atlas & in-memory fallback)
│   │   └── seedDefault.js      # Automatic starter content seeder
│   ├── controllers/
│   │   ├── authController.js   # Register, login, get current user
│   │   ├── postController.js   # CRUD operations & author validation
│   │   └── commentController.js# Create, read, and delete comments
│   ├── middleware/
│   │   ├── auth.js             # JWT verification middleware
│   │   └── errorHandler.js     # Centralized error handler
│   ├── models/
│   │   ├── User.js             # Mongoose User schema
│   │   ├── Post.js             # Mongoose Post schema
│   │   └── Comment.js          # Mongoose Comment schema
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth routes
│   │   ├── postRoutes.js       # /api/posts routes
│   │   └── commentRoutes.js    # /api/comments routes
│   ├── .env                    # Backend environment variables
│   ├── .env.example            # Environment template
│   ├── package.json
│   ├── seeder.js               # Standalone database seeder
│   └── server.js               # Main Express application entry point
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js       # Centralized API fetch wrapper with JWT header
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navigation bar with responsive mobile menu
│   │   │   ├── Footer.jsx      # Site footer
│   │   │   ├── BlogCard.jsx    # Blog card component
│   │   │   ├── CommentSection.jsx # Comments list and submission form
│   │   │   └── ProtectedRoute.jsx # Route authentication guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global user and auth provider
│   │   ├── pages/
│   │   │   ├── HomePage.jsx    # Hero, search, filters, and blog grid
│   │   │   ├── BlogPostPage.jsx# Single article reader and comments
│   │   │   ├── CreateBlogPage.jsx # Blog post creator
│   │   │   ├── EditBlogPage.jsx# Post editor (owner only)
│   │   │   ├── MyBlogsPage.jsx # Author dashboard
│   │   │   ├── LoginPage.jsx   # Login page with demo buttons
│   │   │   ├── RegisterPage.jsx# Registration page
│   │   │   └── NotFoundPage.jsx# 404 Not Found page
│   │   ├── App.jsx             # Router and layouts
│   │   ├── index.css           # Modern design system & CSS variables
│   │   └── main.jsx
│   ├── .env                    # Frontend environment variables
│   ├── .env.example            # Environment template
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm (v9 or newer)

---

### Step 1: Backend Setup

1. Open a terminal and navigate to `backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `backend/.env`:
   ```env
   PORT=5000
   JWT_SECRET=blogsphere_super_secret_jwt_key_2026
   NODE_ENV=development

   # Optional: MongoDB Atlas Connection String
   # Example: mongodb+srv://<username>:<password>@cluster0.mongodb.net/blogsphere?retryWrites=true&w=majority
   # If left empty, an in-memory MongoDB database will be automatically initialized for zero-config local testing!
   MONGODB_URI=
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

---

### Step 2: Frontend Setup

1. Open another terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run at `http://localhost:5173`. Open this URL in your web browser.

---

## 🧪 Demo Accounts for Testing

BlogSphere includes pre-seeded demo accounts for instant testing:

| Role | Email | Password |
|---|---|---|
| **Author 1** | `sarah@example.com` | `password123` |
| **Author 2** | `alex@example.com` | `password123` |

You can also register a brand new account at `/register` anytime.

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Register a new user (`name`, `email`, `password`, `bio`).
- `POST /api/auth/login` — Sign in and receive JWT token (`email`, `password`).
- `GET /api/auth/me` — Retrieve authenticated user profile (*Protected*).

### Blog Posts
- `GET /api/posts` — Get all published blogs (supports `?search=` and `?category=`).
- `GET /api/posts/:id` — Get single blog post by ID with author details.
- `GET /api/posts/user/me` — Get all posts written by current user (*Protected*).
- `POST /api/posts` — Create a new blog post (*Protected*).
- `PUT /api/posts/:id` — Update own post (*Protected*, author check).
- `DELETE /api/posts/:id` — Delete own post and its comments (*Protected*, author check).

### Comments
- `GET /api/posts/:postId/comments` — Get comments for a post.
- `POST /api/posts/:postId/comments` — Add a comment (*Protected*).
- `DELETE /api/comments/:id` — Delete own comment (*Protected*, author check).
