import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectdb from "./src/db/db.js";
import authRouter from "./src/routes/auth.route.js"
import messageRouter from "./src/routes/message.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import GoogleStrategy from "passport-google-oauth20";
import path from "path";
import { fileURLToPath } from "url";
import MongoStore from "connect-mongo";
import { app, io, server } from "./src/config/socket.js";
import userModel from "./src/models/user.model.js";

// fix __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://fullstack-chattingapp-frontend.onrender.com",
    credentials: true,
  })
);
await connectdb();

// Session with MongoStore
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({
      mongoUrl: process.env.MONGOOSE_URI
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: true,
      httpOnly: true,
      sameSite: "none"
    }
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? "https://yourproductiondomain.com/api/auth/google/callback"
          : "https://fullstack-chattingapp-backend.onrender.com/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile._json.email;
        const fullname = profile._json.name;
        const profilepic = profile._json.picture;

        let user = await userModel.findOne({ email });
        if (!user) {
          user = await userModel.create({ email, fullname, profilepic });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id);
  done(null, user);
});

// Attach socket.io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  // Catch all routes
  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}


// Start server
server.listen(process.env.PORT || 5000, () => {
  console.log(`Server connected on port ${process.env.PORT || 5000}`);
});
