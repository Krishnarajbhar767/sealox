# Sealox — Mechanical Seals B2B Platform & Catalog Management

[![Frontend](https://img.shields.io/badge/Frontend-React_19_|_Vite_|_Mantine-blue)](https://vitejs.dev)
[![Backend](https://img.shields.io/badge/Backend-Django_5_|_DRF-green)](https://www.djangoproject.com)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel_%2B_Render-black)](https://vercel.com)

A high-performance B2B catalog platform and administration suite for industrial mechanical seals, featuring instant search, technical assembly schematics, interactive operating limits, and a comprehensive CRUD product management dashboard with toast notifications.

---

## ⚡ Zero-Touch 1-Click Deployment

Sealox is pre-configured for automated deployment with **zero manual database migrations or configuration steps** required after connecting your GitHub repository.

### 1. Backend: Deploy to Render (Free Tier)
1. In your [Render Dashboard](https://dashboard.render.com), click **New +** > **Blueprint**.
2. Select this GitHub repository. Render automatically reads `render.yaml`.
3. Click **Apply**.
4. Render runs `backend/build.sh`, applies migrations, collects static assets via WhiteNoise, and seeds the mechanical seal catalog and admin superuser (`admin` / `password123`).
5. Copy your assigned service URL (e.g., `https://sealox-backend.onrender.com`).

### 2. Frontend: Deploy to Vercel
1. In your [Vercel Dashboard](https://vercel.com), click **Add New...** > **Project** and select this repository.
2. Select Root Directory: `frontend` (or leave as root, root `vercel.json` will route automatically).
3. Under **Environment Variables**, add:
   ```env
   VITE_API_URL=https://sealox-backend.onrender.com
   ```
4. Click **Deploy**.

---

## 💻 Local Development

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+

### Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py seed_products
python manage.py runserver
```
API runs on `http://127.0.0.1:8000/`.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Storefront & Admin panel available at `http://localhost:5173/`.

---

## 🧪 Automated Testing

### Frontend Suite (Vitest + React Testing Library)
```bash
cd frontend
npm run test
```
- **28 / 28 tests passing**: Admin dashboard, product editor, media upload, delete confirmation, custom catalog hooks.

### Backend Suite (Django Test Runner)
```bash
cd backend
python manage.py test products.tests
```
- **15 / 15 tests passing**: Public REST endpoints, admin CRUD operations, versatile image upload, template duplication, visibility toggling.
