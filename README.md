# ReelBoost - SMM Panel Platform

A professional Social Media Marketing (SMM) panel for purchasing social media engagement services.

## 🚀 Features

- **User Authentication**: Email/Password signup & Google OAuth login
- **Service Management**: Browse and order social media services
- **Wallet System**: Secure UPI-based payment system
- **Order Tracking**: Real-time order status updates
- **Referral Program**: Earn commission on referrals
- **Admin Dashboard**: Manage users, services, and orders

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Google OAuth credentials (optional, for Google login)

## 🛠️ Local Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then update the `.env` file with your actual values:

```env
# REQUIRED: MongoDB Connection
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/reelboost?retryWrites=true&w=majority

# REQUIRED: Session Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
SESSION_SECRET=your-random-secret-key-here

# OPTIONAL: Google OAuth (for Google Sign In)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Development Settings
NODE_ENV=development
PORT=5000
REPLIT_DOMAINS=localhost:5000
```

### 3. Get MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<username>`, `<password>`, and `<dbname>` with your values
6. Paste it in your `.env` file as `MONGODB_URI`

### 4. (Optional) Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID
3. Add authorized redirect URI: `http://localhost:5000/api/callback`
4. Copy Client ID and Client Secret to your `.env` file

### 5. Run the Application

```bash
npm run dev
```

The application will be available at: `http://localhost:5000`

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🧪 Testing

### Test Signup (via command line)
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🔧 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `SESSION_SECRET` | Yes | Random secret for session encryption |
| `GOOGLE_CLIENT_ID` | No | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth Client Secret |
| `NODE_ENV` | No | `development` or `production` |
| `PORT` | No | Server port (default: 5000) |
| `REPLIT_DOMAINS` | No | Domain for OAuth callback |

## 📱 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Express.js, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js (Local + Google OAuth)
- **Build Tool**: Vite

## 🔒 Security

- Passwords hashed with bcrypt
- Session-based authentication
- Rate limiting on API endpoints
- Environment variables for sensitive data
- No hardcoded credentials

## 📝 License

MIT

## 🆘 Troubleshooting

### MongoDB Connection Error
- Check your MongoDB URI is correct
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify username and password

### Port Already in Use
- Change `PORT` in `.env` to a different port (e.g., 3000)

### Google OAuth Not Working
- Verify redirect URI matches exactly: `http://localhost:5000/api/callback`
- Check Client ID and Secret are correct
- Email/password signup will still work without Google OAuth
