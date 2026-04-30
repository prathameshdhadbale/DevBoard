
# DevBoard

> A kanban-style job and internship application tracker for developers.  
> Built to solve the real problem of managing multiple applications across different stages — without losing track of anything.

🔗 **Live:** [devboard-git-main-prathameshs-projects-a170c6b9.vercel.app](https://devboard-git-main-prathameshs-projects-a170c6b9.vercel.app)

---

## What it does

Most developers track job applications in notes, spreadsheets, or their memory. DevBoard replaces that chaos with a visual board where every application lives as a card, moves through stages, and surfaces actionable follow-up reminders.

---

## Features

- **Kanban Board** — 5 columns: Applied → Interview → Assignment → Offer → Rejected
- **Drag and Drop** — move cards between columns to update status in real-time
- **Add / Edit / Delete** — full CRUD on application cards
- **Stats Dashboard** — live counts for total, active, interviews, offers, rejected, response rate
- **Follow-up Reminders** — highlights applications where your set follow-up date has passed
- **JWT Authentication** — register, login, and secure routes — every user sees only their own data

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 (Vite) |
| Routing | React Router DOM v7 |
| Drag and Drop | @hello-pangea/dnd |
| Styling | Plain CSS with CSS variables |
| Backend | Node.js + Express 5 |
| Auth | JWT + bcrypt |
| Database | PostgreSQL (Neon) |
| DB Client | pg (node-postgres) |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## Project Structure

```
DevBoard/
├── client/                   # React frontend (Vite)
│   └── src/
│       ├── pages/            # LoginPage, DashboardPage
│       ├── components/       # AddCardModal
│       ├── api/              # auth.api.js, applications.api.js
│       ├── context/          # AuthContext.jsx
│       ├── App.jsx
│       └── main.jsx
│
├── server/                   # Node.js backend
│   └── src/
│       ├── config/           # db.js — PostgreSQL connection
│       ├── middleware/       # authMiddleware.js — JWT verification
│       ├── routes/           # authRoutes.js, applicationRoutes.js
│       └── controllers/      # authController.js
│
└── README.md
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL (local or Neon)

### 1. Clone the repo

```bash
git clone https://github.com/prathameshdhadbale/DevBoard.git
cd DevBoard
```

### 2. Setup the database

Run these in psql or pgAdmin:

```sql
CREATE DATABASE devboard;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  company VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  job_link VARCHAR(255),
  notes TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'applied',
  followup_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. Setup the backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
```

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### 4. Setup the frontend

```bash
cd client
npm install
```

Create a `.env` file in `client/`:

```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login and receive JWT |
| GET | /api/applications | Yes | Get all applications |
| POST | /api/applications | Yes | Create new application |
| PATCH | /api/applications/:id | Yes | Update application |
| DELETE | /api/applications/:id | Yes | Delete application |
| GET | /api/applications/stats | Yes | Get stats summary |
| GET | /api/applications/followups | Yes | Get overdue follow-ups |

---

## Author

**Prathamesh Dhadbale**  
B.Tech Computer Science — IIIT Nagpur  
[GitHub](https://github.com/prathameshdhadbale)

---

