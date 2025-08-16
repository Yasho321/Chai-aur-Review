import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.models.js";
import PreRegisteredUser from "../models/preRegisteredUser.models.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:8080/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // Check if user already exists
        const user = await User.findOne({ email });

        if (user) {
          return done(null, user);
        }

        if(email == (process.env.ADMIN_EMAIL)){
              const newUser = await User.create({
                email,
                name: profile.displayName,
                googleId: profile.id,
                role: "admin",
              });
              return done(null, newUser);
        }

        // Check if user is pre-registered
        const preRegistered = await PreRegisteredUser.findOne({ email });

        if (!preRegistered) {
          return done(null, false, { message: "Access denied. Contact administrator." });
        }

        // Create new user
        const newUser = await User.create({
          email,
          name: profile.displayName,
          googleId: profile.id,
          role: "user",
        });

        

        // Update pre-registered status
        preRegistered.hasSignedUp = true;
        await preRegistered.save();

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
