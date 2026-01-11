# 💖 BeenLove Memory

A beautiful, private space to track your relationship journey, count the days you've been together, and capture every precious moment.

![Preview](public/heart.svg) <!-- Replace with a real screenshot later -->

## ✨ Features

-   **💓 Real-time Counter**: Track days, hours, minutes, and seconds since your journey started.
-   **📖 Memory Timeline**: Save photos and stories of your favorite moments.
-   **💭 Special Quote**: Display a meaningful message or "our saying" on your dashboard.
-   **📧 Notifications**: Optional email alerts for anniversaries (via Resend).
-   **🖼️ Local/Cloud Storage**: Supports local image uploads or Vercel Blob.
-   **📱 Responsive Design**: Premium UI built with Tailwind CSS and Framer Motion.

## 🚀 Tech Stack

-   **Framework**: Next.js 14 (App Router)
-   **Styling**: Tailwind CSS + shadcn/ui
-   **Database**: PostgreSQL (via Drizzle ORM)
-   **Animations**: Framer Motion
-   **Icons**: Lucide React
-   **Validation**: Zod + React Hook Form

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/beenlove-memory.git
cd beenlove-memory
```

### 2. Install dependencies
```bash
npm install
```

### 3. Database Setup (Docker)
Ensure you have Docker installed, then run:
```bash
docker compose up -d
```
*This starts a local PostgreSQL instance at port 5432.*

### 4. Environment Variables
Create a `.env.local` file in the root directory:
```env
# Database (Local Docker)
POSTGRES_URL="postgresql://beenlove_user:beenlove_pass@localhost:5432/beenlove"

# Vercel Blob (Optional - for Cloud Storage)
# BLOB_READ_WRITE_TOKEN="..."

# Resend (Optional - for Email Notifications)
# RESEND_API_KEY="..."
```

### 5. Push Database Schema
```bash
npx drizzle-kit push
```

### 6. Run the app
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📁 Project Structure

-   `/src/app`: Next.js pages and API routes.
-   `/src/components`: Reusable UI components.
-   `/src/db`: Database schema and Drizzle config.
-   `/src/lib`: Common utilities and validations.
-   `/public/uploads`: Local storage for your photos.

## 📝 License
MIT
