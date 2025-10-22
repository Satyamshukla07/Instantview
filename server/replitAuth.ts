// Google OAuth authentication with in-memory session for local development
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import MemoryStore from "memorystore";
import { storage } from "./storage";

const SessionStore = MemoryStore(session);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  return session({
    secret: process.env.SESSION_SECRET || "local-dev-secret-change-in-production",
    store: new SessionStore({
      checkPeriod: sessionTtl,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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

  // Only setup Google OAuth if credentials are provided
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const domains = (process.env.REPLIT_DOMAINS || "localhost:5000").split(",");
    
    for (const domain of domains) {
      const callbackURL = domain.includes("localhost") 
        ? `http://${domain}/api/callback`
        : `https://${domain}/api/callback`;
        
      const strategy = new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL,
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
  }

  passport.serializeUser((user: any, cb) => cb(null, user));
  passport.deserializeUser((user: any, cb) => cb(null, user));

  app.get("/api/login", async (req, res, next) => {
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      passport.authenticate(`google:${req.hostname}`, {
        scope: ["profile", "email"],
      })(req, res, next);
    } else {
      // Auto-login for local development without Google OAuth
      const devUser = {
        id: "admin-user-1",
        email: "admin@reelboost.com",
        firstName: "Admin",
        lastName: "User",
      };
      
      try {
        // Ensure user exists in storage (both memory and database)
        await storage.upsertUser({
          id: devUser.id,
          email: devUser.email,
          firstName: devUser.firstName,
          lastName: devUser.lastName,
        });
        
        req.login(devUser, (err) => {
          if (err) return res.status(500).json({ message: "Login failed" });
          res.redirect("/");
        });
      } catch (error) {
        console.error("Error creating dev user:", error);
        res.status(500).json({ message: "Login failed" });
      }
    }
  });

  app.get("/api/callback", (req, res, next) => {
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      passport.authenticate(`google:${req.hostname}`, {
        successRedirect: "/",
        failureRedirect: "/api/login",
      })(req, res, next);
    } else {
      res.redirect("/");
    }
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
