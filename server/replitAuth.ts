// Google OAuth authentication
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Google OAuth credentials not provided");
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

async function upsertUser(profile: any) {
  const userId = profile.id;
  const email = profile.emails?.[0]?.value || "";
  const firstName = profile.name?.givenName || "";
  const lastName = profile.name?.familyName || "";
  const profileImageUrl = profile.photos?.[0]?.value || "";

  await storage.upsertUser({
    id: userId,
    email,
    firstName,
    lastName,
    profileImageUrl,
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Google OAuth strategy for each domain
  for (const domain of process.env.REPLIT_DOMAINS!.split(",")) {
    const strategy = new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `https://${domain}/api/callback`,
        scope: ["profile", "email"],
        passReqToCallback: false,
      },
      async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
          await upsertUser(profile);
          const user = {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            profileImageUrl: profile.photos?.[0]?.value,
          };
          done(null, user);
        } catch (error) {
          done(error as Error);
        }
      }
    );
    passport.use(`google:${domain}`, strategy);
  }

  passport.serializeUser((user: any, cb) => cb(null, user));
  passport.deserializeUser((user: any, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`google:${req.hostname}`, {
      scope: ["profile", "email"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`google:${req.hostname}`, {
      successRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Admin-only middleware
export const isAdmin: RequestHandler = async (req, res, next) => {
  const userId = (req.user as any)?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await storage.getUser(userId);
  if (user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }

  next();
};
