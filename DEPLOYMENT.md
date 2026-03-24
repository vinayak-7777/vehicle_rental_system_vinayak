# Deployment Guide (Free) – Vehicle Rental System

This guide helps you deploy your MERN project using:

- **MongoDB Atlas** (database)
- **Render** (backend API)
- **Vercel** (frontend React app)

It is written for beginners and follows your preferred CORS approach using env vars.

---

## 1) Final Architecture

- **Frontend (Vercel)** calls `VITE_API_URL + /api`
- **Backend (Render)** connects to Atlas and allows only `FRONTEND_URL` via CORS
- **Database (Atlas)** stores all collections

---

## 2) Code already prepared in this project

These are already set in your code:

- Backend CORS in `server/server.js`:

```js
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
```

- Frontend API base URL in `client/src/utils/api.js`:

```js
baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api'
```

So after deployment, you only change environment variables in Render/Vercel.

---

## 3) MongoDB Atlas setup (Free)

### 3.1 Create cluster
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create account / login
- Create a **Free** cluster

### 3.2 Create DB user
- Go to **Database Access**
- Add new user (username/password)
- Save credentials safely

### 3.3 Allow network access
- Go to **Network Access**
- Add IP Address
- For easiest setup, use `0.0.0.0/0` (allow from anywhere)
  - Good for student demo projects
  - For production apps, restrict this

### 3.4 Get connection string
- In cluster, click **Connect**
- Choose **Drivers**
- Copy connection URI like:

`mongodb+srv://<username>:<password>@<cluster-url>/vehicle-rental?retryWrites=true&w=majority`

Replace `<username>` and `<password>`.

You will use this value as `MONGO_URI` in Render.

---

## 4) Deploy backend on Render

### 4.1 Create Render Web Service
- Go to [Render](https://render.com)
- New → **Web Service**
- Connect your GitHub repo
- Select repo and branch

### 4.2 Important Render settings
- **Root Directory**: `server`
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free

### 4.3 Environment Variables in Render
Set these in Render service → **Environment**:

- `PORT` = `5000` (or leave unset; Render provides one automatically)
- `MONGO_URI` = your Atlas connection string
- `JWT_SECRET` = any strong secret string
- `FRONTEND_URL` = your Vercel frontend URL (example: `https://your-app.vercel.app`)

> You can change `FRONTEND_URL` later without code changes (exactly your preferred method).

### 4.4 Deploy
- Click deploy
- Wait until status is **Live**
- Test in browser:
  - `https://<your-render-service>.onrender.com/`
  - Should return: `{ "message": "API is running" }`

### 4.5 (Optional but recommended) Seed sample data
If you want demo users/vehicles in Atlas:

- Open Render service → **Shell**
- Run:

```bash
node scripts/seed.js
```

This creates demo users and vehicles.

> Note: seed script clears existing users/vehicles/payments before inserting fresh sample data.

---

## 5) Deploy frontend on Vercel

### 5.1 Create Vercel project
- Go to [Vercel](https://vercel.com)
- New Project → import your GitHub repo

### 5.2 Framework / Root settings
- **Framework**: Vite (auto-detected)
- **Root Directory**: `client`
- Build settings usually auto-filled:
  - Build Command: `npm run build`
  - Output Directory: `dist`

### 5.3 Environment Variable in Vercel
Set:

- `VITE_API_URL` = `https://<your-render-service>.onrender.com`

Do **not** add `/api` here because code already appends `/api`.

### 5.4 Deploy
- Click Deploy
- Open your Vercel URL after success

---

## 6) Connect CORS correctly (important)

After Vercel gives final URL:

1. Go to Render backend env vars
2. Set `FRONTEND_URL` exactly to your Vercel URL:

`https://your-app.vercel.app`

3. Save and redeploy/restart backend service

If you have preview domains and still get CORS errors, keep `FRONTEND_URL` at your main production domain and use that domain for demo.

---

## 7) Post-deployment checklist

- Backend health route works:
  - `https://<render>.onrender.com/`
- Frontend loads:
  - `https://<vercel>.vercel.app`
- Login works with seeded users
- Vehicle list loads without CORS errors
- Booking create/approve/payment/distribute flows work

---

## 8) Common issues and fixes

### Issue A: CORS error in browser
- Check Render `FRONTEND_URL` matches exact Vercel domain
- Must include `https://`
- Restart/redeploy backend after env change

### Issue B: Frontend shows network error / 404 to API
- Check Vercel env `VITE_API_URL` is correct
- Ensure it is base URL only, e.g. `https://my-api.onrender.com`
- Re-deploy Vercel after env change

### Issue C: 401 Unauthorized on login
- Verify users exist in Atlas (run seed script once)
- Verify email/password from seed:
  - `admin@example.com / admin123`
  - `fleet@example.com / fleet123`
  - `auditor@example.com / auditor123`
  - `john@example.com / user123`

### Issue D: Render free service sleeping
- First request can be slow (30–60+ sec wake-up)
- Normal behavior on free tier

### Issue E: MongoDB connection failed
- Recheck `MONGO_URI`
- Ensure Atlas DB user is correct
- Ensure Atlas Network Access allows your connection (`0.0.0.0/0` for simple setup)

---

## 9) Suggested environment variable summary

### Render (Backend)
- `MONGO_URI` = `mongodb+srv://...`
- `JWT_SECRET` = `your-long-random-secret`
- `FRONTEND_URL` = `https://your-app.vercel.app`
- `PORT` = `5000` (optional)

### Vercel (Frontend)
- `VITE_API_URL` = `https://your-backend.onrender.com`

---

## 10) Deployment order (best practice)

1. Setup Atlas
2. Deploy Render backend
3. Deploy Vercel frontend
4. Copy final Vercel URL into Render `FRONTEND_URL`
5. Re-deploy Render
6. Test end-to-end

---

## 11) Optional: update demo docs after hosting

After deployment, update your report/demo docs with:
- Live frontend URL
- Live backend URL
- Test account credentials

This makes evaluator demo easier.

