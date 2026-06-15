# PlanningIntel AI — Deployment Documentation

This document provides clear, step-by-step instructions for deploying the PlanningIntel AI platform to stable, persistent, production-grade environments.

---

## Technical Stack Overview
- **Frontend/Backend Framework**: Next.js 16.2.9 (App Router)
- **Styling**: Tailwind CSS v4, Lucide React (Icons), Recharts (Charts)
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security)
- **AI Analytics**: OpenAI (GPT-4o)

---

## Required Environment Variables

To ensure proper functionality (including routing, mock service fallbacks, and live APIs), configure the following environment variables on your hosting provider:

| Variable Name | Description | Example / Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project API URL | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anonymous Client Key | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Admin Service Role Key (Server only) | `eyJhbGciOi...` |
| `OPENAI_API_KEY` | OpenAI API Key for Change Detection summaries | `sk-proj-...` |
| `OPENAI_MODEL` | OpenAI Model to target | `gpt-4o` (default) |
| `NEXT_PUBLIC_APP_URL` | Base canonical URL of the application | `https://planningintel.vercel.app` |

*Note: The platform is built with a dual-mode scraper and database engine. If Supabase keys are not present or invalid, it gracefully falls back to memory-stable high-fidelity simulation engines, ensuring your frontend dashboard remains fully populated and functional out-of-the-box.*

---

## Deployment Options

### Option 1: Native Vercel Deployment (Recommended)
Vercel is the natural host for Next.js applications and automatically handles dynamic API routes, serverless functions, and static optimization.

1. **Connect GitHub Repository**:
   - Push this codebase to a GitHub repository.
   - Go to the Vercel Dashboard and click **"Add New"** -> **"Project"**.
   - Select your GitHub repository.
2. **Configure Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (Root)
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
3. **Add Environment Variables**:
   - Add all key-value pairs from the table above.
4. **Deploy**:
   - Click **"Deploy"**. Vercel will build and assign a permanent `*.vercel.app` subdomain with automatic HTTPS certificates and edge functions enabled.

---

### Option 2: Netlify Deployment
Netlify supports full-stack Next.js applications using the `@netlify/plugin-nextjs` adapter.

1. **Create Site**:
   - Link your GitHub repository to Netlify.
   - Select **"Import an existing project"**.
2. **Configure Build Settings**:
   - **Base directory**: Not set (default)
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
3. **Configure Environment Variables**:
   - Add all variables in **"Site configuration"** -> **"Environment variables"**.
4. **Deploy**:
   - Trigger a deploy. Netlify will build and host your app with a permanent `*.netlify.app` subdomain.

---

### Option 3: Railway or Render Deployment
If you prefer containerized or long-running virtual hosting:

1. **Dockerfile**: The project uses a standard Node.js server setup.
2. **Start Command**: `npm run build && npm run start`
3. Ensure port `3000` is mapped and exposed.

---

## Verification Checklist After Deployment
To confirm that your live deployment is healthy and correctly configured, visit these endpoints:
- **Landing Page**: `/` — Should load the responsive, clean Bloomberg-terminal SaaS landing page.
- **SaaS Dashboard**: `/dashboard` — Should load the high-density metrics grids, regional progress bars, and sidebar layout.
- **Appeals Section**: `/dashboard/appeals` — Should load cases with interactive side-panels.
- **Scraper API (Health)**: `GET /api/cron/scrape` — Should return status `ok` and active LPA counts.
- **Digest API (Preview)**: `GET /api/cron/digest` — Should return a weekly change summary and section payloads.
