# AdaptIQ AI

Adaptive Learning, Placement & Interview Preparation Platform — a BTech major project.

AdaptIQ AI helps college students track their learning, detect weak topics, and prepare for placements and interviews, using real performance data, a machine learning model, and an LLM-powered tutor.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas (cloud) + Mongoose
- **Auth:** bcrypt (password hashing) + JWT (sessions)
- **Machine Learning (planned):** Python + scikit-learn + FastAPI
- **AI/LLM (planned):** LLM API for tutoring, quiz generation, and RAG

## Current Status

**Backend — fully working:**
- User authentication (register, login, JWT, protected routes)
- Subjects and Topics (MongoDB-backed)
- Quizzes with server-side scoring (correct answers never sent to the client)
- Quiz attempt history saved per student

**Frontend — in progress:**
- React Router set up with Login, Register, and Dashboard pages
- AuthContext manages login state across the app
- Dashboard currently shows a placeholder; real data integration is next

**Not started yet:**
- Machine learning mastery prediction
- AI tutor and quiz generation (LLM)
- RAG-based PDF study assistant
- Placement module (job description & resume analysis)
- Interview preparation module
- Deployment

## Project Structure