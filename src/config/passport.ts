import dotenv from "dotenv";
import passport from "passport";
import facebook from "passport-facebook";
import User from "../models/User";
dotenv.config();

export default () => {
  const FacebookStrategy = facebook.Strategy;
  const credentials = {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "/auth/facebook/callback",
    enableProof: true, // Require app secret for API reqs
    profileFields: ["id", "displayName", "photos", "email"]
  };

  // Passport receives user profile info after redirect to callbackURL
  const callback = async (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any
  ) => {
    const email = profile.emails[0].value;
    let user: any = await User.findOne({ email });
    if (!user) {
      // User does not exist
      user = new User({
        accountType: "facebook",
        email,
        image: profile.photos[0].value,
        name: profile.displayName
      });
      await user.save();
      done(null, user); // user obj is passed to serializeUser
    } else if (!(user.accountType === "facebook")) {
      // User registered with something other than fb
      done(null, null);
    } else {
      done(null, user);
    }
  };
  passport.use(new FacebookStrategy(credentials, callback));

  // serializeUser: write id to req.session.passport.user after authentication
  passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
  });

  /* On subsequent HTTP requests, if req.session.passport.user (id) exists,
  deserializeUser attaches the relevant user data to req as req.user. */
  passport.deserializeUser(async (id: string, done: any) => {
    const user = await User.findById(id);
    done(null, user);
  });
};
