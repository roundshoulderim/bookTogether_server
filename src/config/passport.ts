import dotenv from "dotenv";
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as KakaoStrategy } from "passport-kakao";
import User from "../models/User";
import axios from "axios";
dotenv.config();

export default () => {
  const fbCredentials = {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: `${process.env.SERVER_URL}/auth/facebook/callback`,
    profileFields: ["id", "displayName", "emails"]
  };

  const kakaoCredentials = {
    clientID: process.env.KAKAO_API_KEY,
    clientSecret: process.env.KAKAO_SECRET,
    callbackURL: `${process.env.SERVER_URL}/auth/kakao/callback`
  };

  // Passport receives user profile info after redirect to callbackURL
  const callback = (provider: string) => async (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any
  ) => {
    try {
      console.log("OAUTH PROFILE", JSON.stringify(profile));
      const email =
        provider === "kakao"
          ? profile._json.kakao_account.email
          : profile.emails[0].value;
      let user: any = await User.findOne({ email });
      if (!user) {
        user = new User({
          accountType: provider,
          email,
          name: profile.displayName
        });
        await user.save();
      }
      done(null, user); // passed to serializeUser, or authenticate() if { session: false }
    } catch (error) {
      console.log("OAUTH ERROR", error.message);
      done(null, { error });
    }
  };

  const facebookHandler = (
    token: string,
    tokenSecret: string,
    profile: object,
    done: any
  ) => {
    console.log("TOKEN", token);
    const url = `https://graph.facebook.com/me?fields=id,email,name&access_token=${token}`;

    axios
      .get(url)
      .then(res => {
        console.log("RESPONSE", JSON.stringify(res));
        return res.data;
      })
      .then(res => {
        console.log("DATA", res);
        done(null, { error: res });
      })
      .catch(error => {
        console.log("ERROR", JSON.stringify(error));
        done(null, { error });
      });
  };

  passport.use(new FacebookStrategy(fbCredentials, facebookHandler));
  passport.use(new KakaoStrategy(kakaoCredentials, callback("kakao")));

  /* Note: these are not necessary b/c we set session.user manually anyways.
  // serializeUser: write id to req.session.passport.user after authentication
  passport.serializeUser((user: any, done: any) => {
    done(null, user);
  });
  // On subsequent HTTP requests, if req.session.passport.user exists,
  // deserializeUser attaches the relevant user data to req as req.user.
  passport.deserializeUser((user: string, done: any) => {
    done(null, user);
  }); */
};
