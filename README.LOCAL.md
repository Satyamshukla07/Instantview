# ReelBoost - Local Development Guide

This guide will help you run ReelBoost on your local machine.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables (Optional)

Copy the example environment file:

```bash
cp .env.example .env
```

**Note:** You don't need to configure anything for basic local development! The app will:
- Use in-memory storage (no database required)
- Auto-login as admin user (no Google OAuth setup needed)
- Run on port 5000

### 3. Run the Application

```bash
npm run dev
```

The application will start on http://localhost:5000

### 4. Access the Application

1. Open your browser and go to http://localhost:5000
2. Click "Login" - you'll be automatically logged in as admin
3. Start exploring the features!

## Features Available Locally

✅ All features work without any configuration:
- **In-Memory Storage**: No database setup required
- **Auto Admin Login**: Instant access without OAuth setup
- **Sample Data**: Pre-loaded with 3 sample services
- **Full Functionality**: Orders, wallet, referrals, admin panel

## Optional: Google OAuth Setup

If you want to use real Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:5000/api/callback`
4. Copy Client ID and Secret to `.env` file:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

## Optional: PostgreSQL Database

If you want persistent storage instead of in-memory:

1. Install PostgreSQL
2. Create a database: `createdb reelboost`
3. Add to `.env`:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/reelboost
   ```
4. Run migrations:
   ```bash
   npm run db:push
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema (if using PostgreSQL)
- `npm run check` - Type check

## Default Admin Credentials

When running without Google OAuth:
- **User ID**: admin-user-1
- **Email**: admin@reelboost.com
- **Role**: Admin
- **Initial Wallet Balance**: ₹1000

## Project Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   └── hooks/       # Custom hooks
├── server/              # Express backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── replitAuth.ts    # Authentication
│   ├── storage.ts       # Database storage
│   ├── memoryStorage.ts # In-memory storage
│   └── db.ts            # Database connection
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database schema
└── package.json
```

## Troubleshooting

### Port Already in Use

If port 5000 is already in use, change it in `.env`:
```
PORT=3000
```

### Module Not Found Errors

Delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Cannot Find Type Definitions

Run type check to identify issues:
```bash
npm run check
```

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Configure Google OAuth credentials
3. Setup PostgreSQL database
4. Set strong `SESSION_SECRET`
5. Build the application: `npm run build`
6. Start server: `npm start`

## Support

For issues or questions, please check the main `replit.md` file for architecture details.

---

**Enjoy building with ReelBoost! 🚀**
