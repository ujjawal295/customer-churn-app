# 🚀 Customer Churn Prediction App

A full-stack AI-powered Customer Churn Prediction application built using **React + Vite** for the frontend and **FastAPI + PostgreSQL** for the backend.

This project predicts whether a customer is likely to churn based on customer-related data and provides an interactive dashboard for predictions.

---

# 📌 Features

* 🔥 Modern React frontend with Vite
* ⚡ FastAPI backend
* 🗄 PostgreSQL database integration
* 🤖 AI-powered churn prediction
* 📊 Interactive UI
* 🌐 REST API support
* 🔐 Environment variable configuration
* 🚀 Deploy-ready architecture

---

# 🛠 Tech Stack

## Frontend

* React
* Vite
* JavaScript
* CSS

## Backend

* FastAPI
* Python
* SQLAlchemy
* PostgreSQL

## AI / ML

* Anthropic API
* Machine Learning Logic

---

# 📂 Project Structure

```bash
customer-churn-app/
│
├── churn-frontend-pg/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── churn-backend-pg/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── .env
│   └── requirements.txt
│
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/ujjawal295/customer-churn-app.git
```

---

# 🖥 Backend Setup

## Move to backend folder

```bash
cd churn-backend-pg
```

## Create virtual environment

```bash
python3 -m venv venv
```

## Activate virtual environment (Mac)

```bash
source venv/bin/activate
```

## Install dependencies

```bash
pip install -r requirements.txt
```

---

# 🗄 PostgreSQL Setup

Install PostgreSQL:

```bash
brew install postgresql
```

Start PostgreSQL:

```bash
brew services start postgresql@18
```

Open PostgreSQL:

```bash
psql postgres
```

Create database:

```sql
CREATE DATABASE churn_db;
```

Exit PostgreSQL:

```sql
\q
```

---

# 🔑 Environment Variables

Create `.env` file inside backend folder:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=
DB_NAME=churn_db

ANTHROPIC_API_KEY=your_api_key
```

---

# ▶️ Run Backend

```bash
uvicorn main:app --reload
```

Backend runs on:

```bash
http://127.0.0.1:8000
```

API Docs:

```bash
http://127.0.0.1:8000/docs
```

---

# 🌐 Frontend Setup

## Move to frontend folder

```bash
cd churn-frontend-pg
```

## Install dependencies

```bash
npm install
```

## Start frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🚀 Deployment

## Frontend Deployment

* Vercel

## Backend Deployment

* Render

## Database

* PostgreSQL

---

# 📸 Screenshots

*Add screenshots here*

---

# 🤝 Contributing

Pull requests are welcome.

For major changes, please open an issue first to discuss what you would like to change.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

## Ujjawal Pandey

* GitHub: https://github.com/ujjawal295

---
