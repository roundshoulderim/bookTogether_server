import dotenv from "dotenv";
import passport from "passport";
import facebook from "passport-facebook";
dotenv.config();

export default () => {
  // serializeUser: hook that saves 'user' obj as req.session.passport.user
  passport.serializeUser((user, cb) => cb(null, user));
  // The user object (passed as the second argument in the callback above) is
  // taken and passed to another callback, attaching user to req as req.user
  passport.deserializeUser((obj, cb) => cb(null, obj));

  // Callback once OAuth sends back user info (save to db here)
  const callback = (
    accessToken: string,
    refreshToken: string,
    profile: object,
    cb: any
  ) => cb(null, profile);
  const FacebookStrategy = facebook.Strategy;
  const facebookConfig = {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "/auth/facebook/callback",
    enableProof: true, // Require app secret for API reqs
    profileFields: ["id", "displayName", "photos", "email"]
  };

  passport.use(new FacebookStrategy(facebookConfig, callback));
};
