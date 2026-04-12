# DevBoard

A kanban-style job and internship application tracker for developers.
Built to solve the problem of managing multiple applications across different stages — without losing track of anything.

## Status
🚧 In active development

## Tech Stack
**Frontend:** React, React Router, @hello-pangea/dnd, Plain CSS
**Backend:** Node.js, Express (in progress)
**Database:** PostgreSQL (in progress)
**Auth:** JWT + bcrypt (in progress)

## Features
- Kanban board with 5 stages — Applied, Interview, Assignment, Offer, Rejected
- Drag and drop cards to update application status
- Add, edit and delete applications
- Stats dashboard — total applied, active, interviews, offers, rejected
- JWT based authentication

## Project Structure
DevBoard/
├── client/         # React frontend (Vite)
└── server/         # Node.js backend (coming soon)

## Running Locally
### Frontend
```bash
cd client
npm install
npm run dev
```
Open http://localhost:5173
