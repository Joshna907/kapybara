Got it! Here’s a fully **copy-paste-ready** `README.md` you can directly use in your GitHub repo:

````markdown
# Kapybara - Blogging Platform

[Live Demo](https://kapybara-kipp.onrender.com/)  

Kapybara is a modern full-stack blogging platform inspired by Medium, built using Next.js, tRPC, and PostgreSQL with Drizzle ORM. Users can read blogs, filter by categories, search posts, and admins can manage posts.

---

## Table of Contents
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Setup Instructions](#setup-instructions)  
- [Database Seeding](#database-seeding)  
- [tRPC Router Structure](#trpc-router-structure)  
- [Trade-offs & Decisions](#trade-offs--decisions)  
- [Time Spent](#time-spent)  

---

## Features

**Priority 1**
- [x] View list of blog posts  
- [x] View a single post  
- [x] Admin can create, edit, and delete posts  

**Priority 2**
- [x] Filter posts by categories  
- [x] Search functionality for posts  
- [x] Responsive design for desktop and mobile  

**Priority 3**
- [x] Share buttons for posts  
- [x] Optimistic UI updates for admin actions  
- [x] Loading & error state handling  

---

## Tech Stack
- **Frontend:** Next.js, React, TailwindCSS  
- **Backend:** Node.js, tRPC  
- **Database:** PostgreSQL with Drizzle ORM  
- **Deployment:** Render  
- **State & Data Fetching:** React Query + Zustand  

---

## Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/Joshna907/kapybara.git
cd kapybara
````

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following:

```env
DATABASE_URL=your_postgres_connection_string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Run the development server**

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Seeding

To populate the database with dummy posts:

```bash
npm run seed
```

This inserts sample posts and categories into your database.

---

## tRPC Router Structure

* **`postRouter`**: Handles CRUD operations for posts

  * `getAll` → Fetch all posts
  * `getBySlug` → Fetch a single post by slug
  * `create` → Admin creates a post
  * `update` → Admin updates a post
  * `delete` → Admin deletes a post

* **`categoryRouter`**: Handles fetching categories and filtering posts

All routers are combined in `appRouter` and exposed to the client using tRPC React hooks.

---

## Trade-offs & Decisions

* Deployed on **Render** instead of Vercel for faster setup.
* Share buttons are basic; full social integration is deferred.
* Minimal state management: React Query handles most data fetching; Zustand is used for global UI state only.



## Time Spent

~30 hours building frontend, backend, and deployment.

