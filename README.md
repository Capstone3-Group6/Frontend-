# Frontend Boilerplate — PERN Capstone

A React + Vite frontend for your capstone, wired to the Express/Postgres
backend. It ships with a working example: the **Tasks** pages do full CRUD
against `/api/tasks`. Copy that shape for your own resources, then delete it.

Stack: **React 19** (with the React Compiler) · **React Router v7** ·
**Tailwind CSS v4** · **Vite**.

## Getting started

```bash
npm install
cp .env.example .env    # sets VITE_API_URL to the local backend
npm run dev             # http://localhost:5173
```

The backend must be running too (see the `backend-boiler` repo) — this app
reads live data from it.

## Structure

```
src/
  main.jsx            wraps the app in <BrowserRouter>
  App.jsx             the route table (which URL shows which page)
  api/
    client.js         fetch wrapper: base URL + shared error handling
    tasks.js          the calls for the "tasks" resource
  components/
    Layout.jsx        shared frame (navbar + page slot)
    Navbar.jsx        top navigation
  pages/
    HomePage.jsx
    TasksPage.jsx     list + create + toggle + delete  (the CRUD example)
    TaskDetailPage.jsx
    NotFoundPage.jsx  the 404 (catch-all route)
```

## How data flows

A page calls a function in `api/tasks.js` → which calls `request()` in
`api/client.js` → which `fetch`es the backend at `VITE_API_URL` → the JSON
comes back and the page stores it in state and renders it.

## Add your own resource

1. **API** — copy `api/tasks.js` to `api/posts.js`, swap the paths.
2. **Pages** — copy the `pages/Tasks*` files for your resource.
3. **Routes** — add `<Route>`s for them in `App.jsx`.
4. **Nav** — add a `<NavLink>` in `Navbar.jsx`.

## Deploy

- `npm run build` outputs a static site to `dist/`.
- Set `VITE_API_URL` to your **deployed** backend URL (env vars are baked in at
  build time, so rebuild after changing it).
- `vercel.json` already sends every path to `index.html` so React Router's
  client-side routes work on refresh. On other hosts (Netlify, etc.) add the
  equivalent SPA/rewrite rule.
